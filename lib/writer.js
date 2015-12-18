import { handleParameterType, handleAnnotationType, writeParam } from './typewriter';

export default function writer(resultMap) {
  for (let [filePath, classMap] of resultMap) {
    for (let [className, classData] of classMap) {
      console.log(writeClass(className, classData));
    }
  }
}

export function writeFunction(name, node) {
  let signature = `${name}`;

  if (node.typeParameters) {
    signature += handleParameterType(node.typeParameters);
  }

  signature += `(${node.params.map(writeParam).join(', ')})`;

  if (node.returnType) {
    signature = `${signature}: ${handleAnnotationType(node.returnType.typeAnnotation)}`;
  }

  return signature;
}

export function writeClass(name, data) {
  let output = [];
  let { classNode, methods } = data;
  let declaration = `declare class ${name}`;

  if (classNode.typeParameters) {
    declaration += handleParameterType(classNode.typeParameters);
  }

  declaration += ' {';

  output.push(declaration);

  for (let node of methods) {
    let signature = writeFunction(node.key.name, node);
    output.push(`    ${signature};`);
  }

  output.push('}');

  return output.join('\n');
}
