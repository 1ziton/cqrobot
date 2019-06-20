const CQHttp = require('cqhttp');
const request = require('request');
const config = require('./config');
const pipelines = require('./app/pipelines');
// utils
const _ = require('./utils/util');
const imgUtil = require('./utils/image');
// module
const SearchPicture = require('./app/search-picture');
const getTyphoonInfo = require('./app/typhoon.js');
const jobs = require('./app/jobs');
const translate = require('./app/translate');

const { apiRoot, accessToken, secret } = config;

const bot = new CQHttp({
  apiRoot,
  accessToken
});

const atLen = 't,qq=3616909583]'.length;

bot.on('message', context => {
  //   console.log('message', context);
  const { message, raw_message, message_type } = context;

  if (message_type === 'group') {
    // at消息
    let idx = message.indexOf('at,qq=3616909583]');
    let msg = message.substring(idx + atLen);
    console.log(msg);
    if (idx === -1) {
      return;
    }
    if (raw_message.includes('德玛西亚')) {
      bot('send_msg', {
        ...context,
        message: '人在塔在！'
      });
      return;
    }
    if (raw_message.includes('!!')) {
      let idx = message.indexOf('!!');
      const projectName = raw_message.substring(idx + 2) || '';
      // console.log('。。。。进来了。。。。。', projectName);

      if (!projectName.trim()) return;
      pipelines
        .queryPipelines(projectName.trim())
        .then(result => {
          bot('send_msg', {
            ...context,
            message: result
          });
        })
        .catch(err => {
          bot('send_msg', {
            ...context,
            message: err.errorMsg
          });
        });
      return;
    }

    msgHandler(msg, context);

    return;
  }

  if (message_type === 'private') {
    msgHandler(message, context);
    return;
  }
});

function msgHandler(text = '', context) {
  // 图片搜索
  if (text.indexOf('图 ') === 0) {
    SearchPicture.getPicture(
      text
        .replace('图', '')
        .replace('图片', '')
        .trim()
    )
      .then(url => {
        if (url) {
          let imgUrl = imgUtil.getImageUrl(url);
          bot('send_msg', {
            ...context,
            message: imgUrl
          });
        }
      })
      .catch(err => {});
  } else if (text.indexOf('查台风') === 0) {
    // 台风查询
    getTyphoonInfo().then(text => {
      text = text || '当前没有台风！';
      bot('send_msg', {
        ...context,
        message: text
      });
    });
  } else if (_.isTranslate(text)) {
    // 词典翻译
    let _text = _.getTransText(text);
    translate(
      Object.assign(
        {
          from: 'en',
          to: 'zh',
          query: _text
        },
        _.transTarget(text)
      ),
      result => {
        bot('send_msg', {
          ...context,
          message: result
        });
      }
    );
  } else if (_.isFindJobs(text)) {
    // 查招聘行情
    jobs().then(result => {
      bot('send_msg', {
        ...context,
        message: result
      });
    });
  }
}

/* bot('send_msg', {
  group_id: '807533895',

  message:
    '&#91;第一部分&#93;[CQ:image,file=123.jpg]图片之后的部分，表情：[CQ:face,id=123]'
})
  .then(() => {
    console.log(11);
  })
  .catch(err => console.log(err)); */

/**
 * 版本 4.x，请用 notice
 */
bot.on('notice', context => {
  console.log('notice', context);
  if (context.notice_type === 'group_increase') {
    // 处理群成员添加事件
    bot('get_group_member_info', {
      group_id: context.group_id,
      user_id: context.user_id
    })
      .then(data => {
        const name = data.nickname || '新人';
        bot('send_group_msg_async', {
          group_id: context.group_id,
          message: `欢迎 ${name} 同学入群～🌹🌹🌹`
        }).catch(err => {});
      })
      .catch(err => {
        console.log(err);
      });
  }
  // 忽略其它事件
});

bot.on('request', context => {
  console.log('request', context);
  if (context.request_type === 'group') {
    // 处理加群请求
    if (context.message !== 'some-secret') {
      return { approve: false, reason: '口令不对' };
    }
    return { approve: true };
  }
  // 忽略其它类型的请求
});

/* bot.on('error', err => {
  console.log(err);
});
 */
bot.listen(8080, '0.0.0.0');

console.log('监听：8080, 0.0.0.0');
