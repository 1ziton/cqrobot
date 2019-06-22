/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-06-22 15:00:28
 * @description: 根据机器人信息，自动触发检查项目服务情况
 */

const exec = require('child_process').exec;
const config = require('../../config');
const facecode = require('../facecode');
const log = require('../../utils/log');
const projectCfgs = require('../../project-config');

const { triggerToken, host } = config.gitlab;

function triggerPipeline(projectName, env) {
  exec(
    `curl -X POST -F token=${triggerToken} -F ref=master  -F "variables[TRG_PROJECT_NAME]=${projectName}" -F "variables[TRG_PROJECT_ENV]=${env}" https://${host}/api/v4/projects/511/trigger/pipeline`,
    function(error, stdout, stderr) {
      if (error) {
        console.error('error: ' + error);
        return;
      }
      log(`${projectName}的${env}环境 pipeline 触发执行`);
      console.log(stdout);
    }
  );
}

function triggerPipelineByProjectName(projectName, env = '') {
  return new Promise((resolve, reject) => {
    const result = checkProjectExist(projectName);
    let item = result[0];
    let keys = [];
    if (result.length === 0)
      return resolve(
        `${
          facecode.question
        } 没有找到 ${projectName} 项目，请检查项目名称是否正确，或者该项目的代码还在编写中……`
      );
    if (item.url && typeof item.url === 'object') {
      keys = Object.keys(item.url);
    }
    console.log(item, keys);
    if (!keys.length) {
      return resolve(
        `${
          facecode.question
        } 没有找到 ${projectName} 需要检查的服务环境，管理员没有维护`
      );
    }
    if (!env) {
      keys.forEach(key => {
        triggerPipeline(projectName, key);
      });
    } else {
      if (item.url && !item.url[env]) {
        return resolve(
          `${
            facecode.question
          } 没有找到 ${projectName} 需要检查的 ${env} 服务环境，管理员没有维护`
        );
      } else if (item.url && item.url[env]) {
        triggerPipeline(projectName, env);
      }
    }

    return resolve(`${facecode.coffee} 已经执行指令，请等待执行结果……`);
  });
}

function checkProjectExist(projectName) {
  const item = projectCfgs.filter(p => p.name === projectName);
  return item;
}

// triggerPipelineByProjectName('ips', 'prod').then(res => console.log(res));

module.exports = {
  triggerPipeline,
  triggerPipelineByProjectName
};
