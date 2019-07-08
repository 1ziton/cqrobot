const FS = require('fs-extra');
const path = require('path');

async function getJSON(filename) {
  let result = await FS.readJSONSync(
    path.join(process.cwd(), 'dist', filename)
  );
  return result;
}

module.exports = getJSON;
