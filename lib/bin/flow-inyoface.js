#! /usr/bin/env node

import parse from '../parser';
import fs from 'fs';
import yargs from 'yargs';
import write from '../writer';

yargs
  .usage('$0 [OPTIONS] [FILES]')
  .help('help')
  .options({
    'output': {
      alias: 'o',
      type: 'string',
      nargs: 1,
      requiresArg: true,
      description: 'File to output to'
    },
    'silent': {
      type: 'boolean',
      alias: 's',
      default: false,
      description: 'Silent parse errors'
    },
    'absolutePaths': {
      type: 'boolean',
      default: false,
      alias: 'ap',
      description: 'Use absolute paths vs relative paths'
    },
    'sourceType': {
      type: 'string',
      alias: 'st',
      choices: ['script', 'module'],
      default: 'module',
      nargs: 1,
      requiresArg: true,
      description: 'Babylon parsing file source type'
    },
    'plugins': {
      type: 'array',
      alias: 'p',
      choices: [
        '*',
        'decorators',
        'asyncFunctions',
        'asyncGenerators',
        'exponentiationOperator'
      ],
      default: '*',
      nargs: 1,
      requiresArg: true,
      description: 'Babel plugins to enable while parsing'
    }
  });

const argv = yargs.argv;

if (!argv._.length) {
  console.log(yargs.help());
  process.exit(0);
}

const interfaces = parse(argv._, {
  silent: argv.silent,
  absolutePaths: argv.absolutePaths,
  parsing: {
    sourceType: argv.sourceType,
    plugins: argv.plugins.concat(['flow'])
  }
});

write(interfaces);

// if (argv.output) {
//   fs.writeFileSync(argv.output, header + '\n' + tags.join('\n'));
// } else {
//   if (argv.header) {
//     process.stdout.write(header + '\n');
//   }

//   process.stdout.write(tags.join('\n'));
// }
