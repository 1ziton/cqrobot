const CQHttp = require('cqhttp');
const config = require('./config');
const pipelines = require('./app/pipelines');

const { apiRoot, accessToken, secret } = config;

const bot = new CQHttp({
  apiRoot,
  accessToken
});

bot.on('message', context => {
  console.log('message', context);
  const { message, raw_message, message_type } = context;

  if (message_type === 'group') {
    // at消息
    let idx = message.indexOf('at,qq=3616909583]');
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
      const projectName = raw_message.substring(idx + 1) || '';
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
    }
  }
});

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

console.log('ssssa'.includes('b'));
