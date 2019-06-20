const cheerio = require('cheerio');

const saveData = require('../utils/saveData');

function getToutiaoData(day = 7) {
  return fetch(`https://toutiao.io/posts/hot/${day}`)
    .then(res => res.buffer())
    .then(data => {
      const html = data.toString();
      const $ = cheerio.load(html);
      const toutiaoData = [];
      $('.container .posts .post').each((idx, item) => {
        const title = $(item)
          .find('h3.title a')
          .text();
        const url = $(item)
          .find('h3.title a')
          .attr('href');
        const description = $(item)
          .find('p.summary a')
          .text();
        const votes = $(item)
          .find('.upvote .like-button span')
          .text();
        const avatar = $(item)
          .find('.user-info .user-avatar img')
          .attr('src');
        const avatarAlt = $(item)
          .find('.user-info .user-avatar img')
          .attr('alt');
        const subjectName = $(item)
          .find('.subject-name a')
          .text();
        const homeUrl = $(item)
          .find('.subject-name a')
          .attr('href');
        toutiaoData.push({
          title,
          description,
          votes,
          url: 'https://toutiao.io' + url,
          avatar,
          avatarAlt,
          subjectName,
          homeUrl
        });
      });
      return toutiaoData;
    });
}

function generateDataJson() {
  (async () => {
    let data = await getToutiaoData(7);
    await saveData(data, 'toutiao-7.json');
    console.log(`> 共获取开发者头条最近 7 天 ${data.length} 条数据！`);

    data = await getToutiaoData(30);
    await saveData(data, 'toutiao-30.json');
    console.log(`> 共获取开发者头条最近 30 天 ${data.length} 条数据！`);

    data = await getToutiaoData(90);
    await saveData(data, 'toutiao-90.json');
    console.log(`> 共获取开发者头条最近 90 天 ${data.length} 条数据！`);
  })();
}

function getData() {
  const acticles = require('../dist/toutiao-7.json');
  return acticles.slice(0, 6);
}

module.exports = {
  generateDataJson,
  getData
};
