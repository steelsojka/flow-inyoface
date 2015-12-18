export const annotationHandlers = {
  GenericTypeAnnotation(node) {
    return node.id.name;
  },

  StringTypeAnnotation(node) {
    return 'string';
  },

  ArrayTypeAnnotation(node) {
    let type = handleAnnotationType(node.elementType);
    
    return `${type}[]`;
  },

  AnyTypeAnnotation(node) {
    return 'any';
  },

  NumberTypeAnnotation(node) {
    return 'number';
  },

  VoidTypeAnnotation(node) {
    return 'void';
  },

  BooleanTypeAnnotation(node) {
    return 'boolean';
  },

  MixedTypeAnnotation(node) {
    return 'mixed';
  },

  FunctionTypeAnnotation(node) {
    return 'Function';
  },

  ObjectTypeAnnotation(node) {
    return ['{', node.properties.map(writeProp).join(', '), '}'].join('');
  },

  NullableTypeAnnotation(node) {
    return `?${handleAnnotationType(node.typeAnnotation)}`;
  },

  TypeofTypeAnnotation(node) {
    return `typeof ${handleAnnotationType(node.argument)}`;
  }
}

export const typeParameterHandlers = {
  TypeParameterInstantiation(node) {
    return `<${node.params.map(handleAnnotationType).join(', ')}>`;
  },

  TypeParameterDeclaration(node) {
    return `<${node.params.map(node => node.name).join(', ')}>`;
  }
};

export function handleAnnotationType(node) {
  let result = handleType(annotationHandlers, node);

  if (node.typeParameters) {
    let types = handleParameterType(node.typeParameters);
    
    result += types;
  }

  return result;
}

export const handleParameterType = handleType.bind(this, typeParameterHandlers);

export function handleType(handlers, node) {
  try {
    if (handlers[node.type]) {
      return handlers[node.type](node);
    } else {
      console.log(node);
    }
  } catch (e) {
    console.log(e);
    console.log(node);
  }
}

export function writeProp(node) {
  let output = [];

  if (node.static) {
    output.push('static ');
  }

  output.push(node.key.name);

  if (node.optional) {
    output.push('?')
  }

  output.push(': ', handleAnnotationType(node.value));

  return output.join('');
}

export function writeParam(node) {
  let paramString = [];

  if (node.type === 'AssignmentPattern') {
    node = node.left;
  }

  if (node.type === 'RestElement') {
    paramString.push('...', node.argument.name);
  } else {
    paramString.push(node.name);
  }

  if (node.optional) {
    paramString.push('?')
  }

  paramString.push(`: `);

  paramString.push(handleAnnotationType(node.typeAnnotation.typeAnnotation));

  return paramString.join('');
}

export default annotationHandlers;
