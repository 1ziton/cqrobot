/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-08-29 11:36:18
 * @description: 包装fetch
 */

require('es6-promise').polyfill();
require('isomorphic-fetch');
const config = require('../../config');

const {
  gitlab: { privateToken, host }
} = config;

const handlePromise = promise =>
  promise.then(res => [null, res]).catch(err => [err, null]);

const options = {
  method: 'post',
  'Content-Type': 'text/html; charset=UTF-8',
  headers: {
    'Content-Type': 'application/json',
    'Private-Token': privateToken
  },
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
};

function request(url, method) {
  const reqUrl = encodeURI(`https://${host}/api/v4/${url}`);
  console.log(method + ':::' + reqUrl);
  if (method) options['method'] = method;
  return new Promise((resolve, reject) => {
    fetch(reqUrl, options)
      .then(response => {
        if (method && ['delete', 'put'].includes(method.toLowerCase())) {
          return resolve({});
        }

        return response.json();
      })
      .then(json => {
        if ((json && json.message) || json.error) {
          console.log('操作失败');
          return reject(json);
        }
        return resolve(json);
      })
      .catch(err => {
        console.log(err);
        console.log('接口请求异常');
        return reject(err);
      });
  });
}

module.exports = { request, handlePromise };
