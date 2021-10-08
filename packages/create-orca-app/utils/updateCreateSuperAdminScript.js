const fs = require('fs');

module.exports = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const updatedFile = file.replace('orca-api', 'api');
  fs.writeFileSync(filePath, updatedFile, 'utf-8');
};
