export default {
  ClassMethod(node, classMap) {
    let classNode = walkUpTillType(node, 'ClassDeclaration');
    let className = classNode.id.name;

    if (!classMap.has(className)) {
      classMap.set(className, {
        classNode,
        methods: []
      });
    }

    if (classNode) {
      classMap.get(className).methods.push(node);
    }
  }
}

function walkUpTillType(node, type) {
  let root = node;

  while (root && root.type !== type) {
    root = root.parent;
  }

  return root;
}
