/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-06-20 13:30:11
 * @description: gitlab pipelines 状态查询
 */

const request = require('request');
const config = require('../../config');
const { getProjectIdByName } = require('./project');

const {
  gitlab: { privateToken, host }
} = config;

function pipelinesInRunning(projectId) {
  const configOptions = {
    url: `https://${host}/api/v4/projects/${projectId}/pipelines?status=running`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Private-Token': privateToken
    }
  };
  return new Promise((resolve, reject) => {
    request(configOptions, (error, response, body) => {
      if (!error && response.statusCode !== 200) {
        return reject({ errorMsg: '查询Pipelines错误', error, body });
      }

      return resolve(JSON.parse(body));
    });
  });
}

function queryPipelines(projectName) {
  return new Promise((resolve, reject) => {
    getProjectIdByName(projectName)
      .then(projectId => {
        console.log(`projectId：${projectId}`);
        pipelinesInRunning(projectId)
          .then((result = []) => {
            let newResult = result.map(item => ({
              '分支 名称': item.ref,
              'Pipeline status': '正在执行…',
              'Pipeline URL': item.web_url
            }));
            if (newResult.length === 0) {
              newResult = [projectName + ' 项目没有正在执行的 Pipelines '];
            }
            return resolve(JSON.stringify(newResult));
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
}

/* queryPipelines('scm-web')
  .then(result => console.log(result))
  .catch(err => console.log(err));
 */
module.exports = {
  queryPipelines
};
