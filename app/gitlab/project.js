const request = require('request');
const config = require('../../config');
const {
  gitlab: { host }
} = config;

function getPojectId() {
  return new Promise((resolve, reject) => {
    request(
      `https://${host}/front-end/team/raw/master/coolq/projects.json`,
      (error, response, body) => {
        if (error && response.statusCode !== 200) {
          console.log('error:', error);
          return reject(error);
        }
        return resolve(body);
      }
    );
  });
}

function getProjectIdByName(projectName) {
  return new Promise((resolve, reject) => {
    getPojectId().then(data => {
      const projects = JSON.parse(data);
      //   console.log(projects);
      const arr = projects.filter(p => p.name === projectName);
      if (arr.length) return resolve(arr[0]['id']);
      return reject({
        errorMsg: `没有找到名称为：${projectName} 的工程`,
        error: 'not found project'
      });
    });
  });
}

module.exports = {
  getPojectId,
  getProjectIdByName
};
