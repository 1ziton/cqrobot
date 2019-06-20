const CQHttp = require('cqhttp');

const config = require('./config');

const { apiRoot, accessToken, secret } = config;

const bot = new CQHttp({
  apiRoot,
  accessToken
});

bot.on('message', context => {
  console.log(context);
  bot('send_msg', {
    ...context,
    message: '哈喽～'
  });
});

bot('send_msg', {
  user_id: '1020279026',
  message: '哈喽～'
});

/**
 * 版本 3.x，请用 event
 */
bot.on('event', context => {
  console.log(context);
  if (context.event === 'group_increase') {
    // 处理群成员添加事件
    bot('get_group_member_info', {
      group_id: context.group_id,
      user_id: context.user_id
    })
      .then(data => {
        const name = data.nickname || '新人';
        bot('send_group_msg_async', {
          group_id: context.group_id,
          message: `欢迎${name}～`
        }).catch(err => {});
      })
      .catch(err => {
        console.log(err);
      });
  }
  // 忽略其它事件
});

/**
 * 版本 4.x，请用 notice
 */
bot.on('notice', context => {
  console.log(context);
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
          message: `欢迎${name}～`
        }).catch(err => {});
      })
      .catch(err => {
        console.log(err);
      });
  }
  // 忽略其它事件
});

bot.on('request', context => {
  console.log(context);
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
