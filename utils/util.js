/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-08 11:38:40
 * @description: 杂乱的utils
 */

// 翻译
function isTranslate(text) {
  return (
    zh2en(text) ||
    en2zh(text) ||
    zh2jp(text) ||
    jp2zh(text) ||
    zh2kor(text) ||
    kor2zh(text)
  );
}

function zh2en(text) {
  return text.startsWith('中译英');
}

function en2zh(text) {
  return text.startsWith('英译中');
}

function zh2jp(text) {
  return text.startsWith('中译日');
}

function jp2zh(text) {
  return text.startsWith('日译中');
}

function zh2kor(text) {
  return text.startsWith('中译韩');
}

function kor2zh(text) {
  return text.startsWith('韩译中');
}

function transTarget(text) {
  if (zh2en(text)) {
    return {
      from: 'zh',
      to: 'en'
    };
  } else if (en2zh(text)) {
    return {
      from: 'en',
      to: 'zh'
    };
  } else if (zh2jp(text)) {
    return {
      from: 'zh',
      to: 'jp'
    };
  } else if (jp2zh(text)) {
    return {
      from: 'jp',
      to: 'zh'
    };
  } else if (zh2kor(text)) {
    return {
      from: 'zh',
      to: 'kor'
    };
  } else if (kor2zh(text)) {
    return {
      from: 'kor',
      to: 'zh'
    };
  }
}

function getTransText(text) {
  return text.replace(/中译英|英译中|中译日|日译中|中译韩|韩译中/g, '').trim();
}

// 查招聘行情
function isFindJobs(text) {
  return text.startsWith('查招聘');
}

module.exports = {
  isFindJobs,
  getTransText,
  transTarget,
  isTranslate
};
