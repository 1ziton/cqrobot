/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-06-20 17:56:59
 * @description: 消息发送
 */

module.exports = function(bot, msg, group) {
  return new Promise((resolve, reject) => {
    const message =
      `《${msg.title}》\n` +
      `${msg.description}\n` +
      `${msg.votes ? `点赞数：${msg.votes}，` : ''}` +
      `来源：「${msg.subjectName}」\n` +
      `原文链接：${msg.url}\n` +
      '------------------------------\n\n';

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
};
