/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-06-21 01:16:36
 * @description: 即刻rss
 */

const rp = require('request-promise');
const Parser = require('rss-parser');
const dayjs = require('dayjs');
const log = require('../utils/log');

// RSSHUB链接
const worldNewsRssUrl =
  'https://s2.rsshub.app/jike/topic/text/553870e8e4b0cafb0a1bef68';

function getData() {
  const today = dayjs().format('YYYY-MM-DD');
  // console.log(today);
  return rp
    .get(worldNewsRssUrl, {
      /*  qs: {
        limit: 5
      }, */
      transform: async function(body, response, resolveWithFullResponse) {
        if (
          response.headers['content-type'] === 'application/xml; charset=utf-8'
        ) {
          const parser = new Parser();
          const feed = await parser.parseString(body);
          return feed;
        } else {
          return body;
        }
      }
    })
    .then(async function(feed) {
      const { items } = feed;
      let result = items.filter(item => {
        return today === dayjs(new Date(item.pubDate)).format('YYYY-MM-DD');
      });
      if (result.length === 0) {
        return Promise.resolve(null);
      }
      let content = result[0]['content'];
      let title = `一觉醒来世界发生了什么 - ${today}`;
      content = content.replace(/<br \/>/g, '\n');
      content = title + '：\n' + content;
      return Promise.resolve(content);
    })
    .catch(err => {
      if (err.statusCode) {
        log(`jike 请求RSSHub失败`, err.statusCode);
        return Promise.reject(err);
      }
      log(`jike 请求RSSHub失败`, err.stack);
      return Promise.reject(err);
    });
}

getData().then(result => console.log(result));

module.exports = {
  getData
};
