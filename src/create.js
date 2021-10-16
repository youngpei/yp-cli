const ora = require('ora');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const { promisify } = require('util');
let downLoadGit = require('download-git-repo');
downLoadGit = promisify(downLoadGit);

let ncp = require('ncp');
ncp = promisify(ncp);

const config = require('./config');

const MetalSmith = require('metalsmith'); // 遍历文件夹
let { render } = require('consolidate').ejs;
render = promisify(render); // 包装渲染方法

const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

const fetchRepoList = async () => {
  // const { data } = await axios.get('https://***/repos')
  const data = [
    {
      name: 'vue2-template'
    },
    {
      name: 'vue3-ts-vite-template'
    }
  ]
  return data;
}

const fetchTagList = async (repo) => {
  // const { data } = await axios.get(`https://***/${repo}/tags`)
  const data = [
    { name: 'v4' },
    { name: 'v3' },
    { name: 'v2' },
    { name: 'v1' },
  ]
  return data;
}

const wrapFetchAddLoading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const r = await fn(...args);
  spinner.succeed();
  return r;
}

const download = async (repo, tag) => {
  let api = `**/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  await downLoadGit(api, dest);
  return dest;
}

const downloadFromLocal = async (repo, tag) => {
  const dest = path.resolve(__dirname, `../templates/${repo}`)
  return dest;
}

// 创建项目
module.exports = async (projectName) => {
  let repos = await wrapFetchAddLoading(fetchRepoList, 'fetching repo list')();

  // 选择模版
  repos = repos.map((item) => item.name);
  const { repo } = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: repos,
  })

  // 获取本本信息
  let tags = await wrapFetchAddLoading(fetchTagList, 'fetching repo tags')(repo);

  // 选择版本
  tags = tags.map((item) => item.name);
  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: tags
  })

  // 获取仓库地址
  // const repoUrl = config('getVal', 'repo');
  // 下载网络项目
  // const target = await wrapFetchAddLoading(download, `download template`)(repo, tag)
  // 复制本地项目
  const target = await wrapFetchAddLoading(downloadFromLocal, `download template`)(repo, tag)

  // 将下载的文件拷贝到当前执行命令的目录下
  // await ncp(target, path.join(path.resolve(), projectName));
  // 没有ask文件说明不需要编译
  if (!fs.existsSync(path.join(target, 'ask.js'))) {
    await ncp(target, path.join(path.resolve(), projectName));
  } else {
    await new Promise((resovle, reject) => {
      MetalSmith(__dirname)
        .source(target) // 遍历下载的目录
        .destination(path.join(path.resolve(), projectName)) // 输出渲染后的结果
        .use(async (files, metal, done) => {
          // 弹框询问用户
          const result = await inquirer.prompt(require(path.join(target, 'ask.js')));
          const data = metal.metadata();
          Object.assign(data, result); // 将询问的结果放到metadata中保证在下一个中间件中可以获取到
          delete files['ask.js'];
          done();
        })
        .use((files, metal, done) => {
          Reflect.ownKeys(files).forEach(async (file) => {
            let content = files[file].contents.toString(); // 获取文件中的内容
            if (file.includes('.js') || file.includes('.json')) { // 如果是js或者json才有可能是模板
              if (content.includes('<%')) { // 文件中用<% 我才需要编译
                content = await render(content, metal.metadata()); // 用数据渲染模板
                files[file].contents = Buffer.from(content); // 渲染好的结果替换即可
              }
            }
          });
          done();
        })
        .build((err) => { // 执行中间件
          if (!err) {
            resovle();
          } else {
            reject();
          }
        });
    });
  }
};