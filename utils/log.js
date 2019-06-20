const dayjs = require('dayjs');

module.exports = (msg, error) => {
  const date = dayjs().format('D日HH:mm:ss');
  let message = date + ': ' + msg;
  if (error) {
    message = `${message}\n${error}\n`;
  }
  console.log(message);
};
