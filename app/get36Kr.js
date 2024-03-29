const dayjs = require('dayjs');
const saveData = require('../utils/saveData');

function get36KrData(page = 20) {
  return fetch(`https://36kr.com/pp/api/newsflash?per_page=${page}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.data && data.data.items) {
        return data.data.items.map(item => {
          return {
            title: item.title,
            description: item.description,
            url: item.news_url,
            news_url: item.news_url,
            subjectName: '36Kr快讯',
            created_at: item.created_at
          };
        });
      } else {
        return [];
      }
    });
}

function generateDataJson() {
  (async () => {
    let data = await get36KrData();
    if (data.length > 0) {
      const date = dayjs().format('YYYY-MM-DD');
      console.log(`> 共获取 36Kr 快讯 ${data.length} 条原始数据！${date}`);
      data = data.filter(item => {
        if (
          item.created_at &&
          date === item.created_at.split(' ')[0] &&
          item.news_url
        ) {
          return true;
        }
        return false;
      });
      console.log(`> 共过滤 ${date} 36Kr 快讯 ${data.length} 条数据！`);
    }
    if (data.length > 0) {
      await saveData(data, '36kr.json');
    }
    console.log(`> 共获取 36Kr 快讯 ${data.length} 条数据！`);
  })();
}

async function getData() {
  const acticles = await getJSON('36kr.json');
  return acticles.slice(0, 9);
}

module.exports = {
  generateDataJson,
  getData
};
