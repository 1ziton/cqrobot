/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-06-20 17:56:59
 * @description: 消息发送
 */

const dayjs = require('dayjs');

function send(bot, msg, group) {
  let message = '';
  const dateStr = dayjs().format('M月D日');
  return new Promise((resolve, reject) => {
    if (Array.isArray(msg)) {
      message = `${dateStr}晨报：\n` + '-----------------------------\n';
      msg.forEach(item => {
        message += `>《${item.title}》: ${item.url}\n`;
      });
    } else if (msg.title) {
      message =
        `《${msg.title}》\n` +
        `${msg.description}\n` +
        `${msg.votes ? `点赞数：${msg.votes}，` : ''}` +
        `来源：「${msg.subjectName}」\n` +
        `原文链接：${msg.url}\n` +
        '------------------------------\n\n';
    } else {
      message = msg;
    }

    if (Array.isArray(group)) {
      let sendArr = [];
      group.forEach(group_id => {
        sendArr.push(
          bot('send_group_msg', {
            group_id: group_id,
            message: message
          })
        );
      });
      Promise.all(sendArr)
        .then(resolve)
        .catch(reject);
    } else {
      bot('send_group_msg', {
        group_id: group,
        message: message
      })
        .then(resolve)
        .catch(reject);
    }
  });
}

module.exports = send;
