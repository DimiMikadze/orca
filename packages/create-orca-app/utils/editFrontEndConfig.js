const fs = require('fs');

module.exports = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const updatedFile = file.replace('https://api.getorca.org', 'http://localhost:4000');
  fs.writeFileSync(filePath, updatedFile, 'utf-8');
};
