/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-6-20 18:48:58
 * @description: 定时器
 */
require('./utils/polyfill');
const CronJob = require('cron').CronJob;
const del = require('del');
const Toutiao = require('./app/geToutiao');
const Kr36 = require('./app/get36Kr');
const send = require('./utils/send');
const log = require('./utils/log');
const config = require('./config');

/**
*  Crontab 的格式说明如下:
* 逗号(',') 指定列表值。如: "1,3,4,7,8"
* 中横线('-') 指定范围值 如 "1-6", 代表 "1,2,3,4,5,6"
* 星号 ('*') 代表所有可能的值
Linux(开源系统似乎都可以)下还有个 "/" 可以用. 在 Minute 字段上，`*\/15`
 表示每 15 分钟执行一次. 而这个特性在商业 Unix ，比如 AIX 上就没有.
* Use the hash sign to prefix a comment 
* +---------------- minute (0 - 59) 
* |  +------------- hour (0 - 23) 
* |  |  +---------- day of month (1 - 31) 
* |  |  |  +------- month (1 - 12) 
* |  |  |  |  +---- day of week (0 - 7) (Sunday=0 or 7) 
* |  |  |  |  | * *  *  *  *  *  command to be executed
*/

let _bot;
function publish(msgList, groupIds) {
  let sendArr = [];
  for (let msg of msgList) {
    sendArr.push(send(_bot, msg, groupIds));
  }

  Promise.all(sendArr)
    .then(() => {
      log(`定时消息发送成功`);
    })
    .catch(err => {
      log(`定时发送失败`, err.stack ? err.stack : err);
    });
}

module.exports = function(bot) {
  _bot = bot;
  //   console.log(_bot);
  // 每天，8点整同步数据
  let job_datasync = new CronJob(
    `00 8 * * *`,
    () => {
      Toutiao.generateDataJson();
      Kr36.generateDataJson();
    },
    null,
    true,
    'Asia/Shanghai'
  );

  // 每天，8点50分推送头条信息
  let job_toutiao_notice = new CronJob(
    `50 8 * * 1-6`,
    () => {
      let articles = Toutiao.getData();
      publish(articles, config.rss.groupIds);
    },
    null,
    true,
    'Asia/Shanghai'
  );
  // 每天，9点00分推送36kr信息
  let job_kr36_notice = new CronJob(
    `00 9 * * *`,
    () => {
      let articles = Kr36.getData();
      publish(articles, config.rss.kr36GroupIds);
    },
    null,
    true,
    'Asia/Shanghai'
  );
  //   let test = new CronJob(
  //     '*/10 * * * * *',
  //     () => {
  //       console.log('执行了');
  //       // Toutiao.generateDataJson();
  //       //   Kr36.generateDataJson();
  //       // let articles = Toutiao.getData();
  //       let articles = Kr36.getData();
  //       publish(articles);
  //     },
  //     null,
  //     true,
  //     'Asia/Shanghai'
  //   );

  job_datasync.start();
  job_kr36_notice.start();
  job_toutiao_notice.start();
  //   test.start();
  log('job started');
};
