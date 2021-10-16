const program = require('commander');
const path = require('path');
const { version } = require('./utils/constants');

const actionsMap = {
  create: { // 创建模版
    description: 'create project',
    alias: 'cr',
    examples: [
      'yp-cli creare <template-name>',
    ]
  },
  config: { // 配置配置文件
    description: 'config info',
    alias: 'c',
    examples: [
      'yp-cli config get <k>',
      'yp-cli config set <k> <v>',
    ]
  },
  '*': {
    description: 'conmmand not found',
    alias: 'use --help'
  }
};

// 循环创建命令
Object.keys(actionsMap).forEach((action) => {
  console.log()
  program
    .command(action).alias(actionsMap[action].alias).description(actionsMap[action].description).action(() => {
      console.log(action)
      if (action === '*') {
        console.log(actionsMap[action].description);
      } else {
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    })
})

program.on('--help', () => {
  console.log('Examples');
  Object.keys(actionsMap).forEach((action) => {
    (actionsMap[action].examples || []).forEach((example) => {
      console.log(`${example}`);
    })
  })
})

program.version(version).parse(process.argv);