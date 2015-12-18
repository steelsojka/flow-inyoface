export default function walk(node, parent, cb) {
  for (let key of Object.keys(node)) {
    if (key === 'parent') {
      continue;
    }

    let child = node[key];

    if (Array.isArray(child)) {
      for (let sub of child) {
        if (sub && typeof sub.type === 'string') {
          sub.parent = node;
          walk(sub, node, cb);
        }
      }
    } else if (child && typeof child.type === 'string') {
      child.parent = node;
      walk(child, node, cb);
    }
  }

  cb(node);
}
