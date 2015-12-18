import { parse as babylon } from 'babylon';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

import walk from './walk';
import handlers from './handlers';
import resolve from './utils/resolve';

export default function parse(files, options = {}) {
  let result = new Map();

  files = Array.isArray(files) ? files : Array.of(files);

  for (let fileGlob of files) {
    for (let file of glob.sync(fileGlob)) {
      result.set(file, parseFile(file, options));
    }
  }

  return result;
}

function parseFile(file, options = {}) {
  let result = new Map();
  let content = fs.readFileSync(file).toString();

  try {
    let ast = babylon(content, options.parsing);

    walk(ast, undefined, node => {
      let handler = handlers[node.type];

      if (handler) {
        handler(node, result);
      }
    });

  } catch(e) {
    if (!options.silent) {
      throw e;
    }
  }

  return result;
}
