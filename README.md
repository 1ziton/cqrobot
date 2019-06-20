# cqrobot

基于 CoolQ HTTP 和 [cqhttp-node-sdk](https://github.com/richardchien/cqhttp-node-sdk) 实现的 QQ 机器人

![autoreply](https://user-images.githubusercontent.com/8676711/59826919-f4d59d00-9369-11e9-9755-ac0b5c794064.png)

## Usage

- npm install
- 重命名 `config.js.sample` 文件为 `config.js`，并修改里边的配置属性为自己的
- npm run start

> 注意： bot.listen 的端口就是 cqhttp post_url 的接口，部署脚本的时候保证脚本和服务器在一个局域网内，我远程调试不行，代码上传服务器才正常接收到消息。

## License

MIT

---

> [giscafer.com](http://giscafer.com) &nbsp;&middot;&nbsp;
> GitHub [@giscafer](https://github.com/giscafer) &nbsp;&middot;&nbsp;
> Twitter [@nickbinglao](https://twitter.com/nickbinglao) &nbsp;&middot;&nbsp;
> Weibo [@giscafer](https://weibo.com/laohoubin)
