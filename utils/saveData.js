const FS = require('fs-extra');
const path = require('path');

async function saveData(data, filename) {
  await FS.outputFile(
    path.join(process.cwd(), 'dist', filename),
    JSON.stringify(data, null, 2)
  );
}

module.exports = saveData;
