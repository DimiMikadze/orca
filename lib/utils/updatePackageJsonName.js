const fs = require('fs');

/**
 * Updates project's name in templates package.json file
 *
 * @param {string} filePath
 * @param {string} name
 */
module.exports = (filePath, name) => {
  const jsonString = fs.readFileSync(filePath);
  const packageJsonFile = JSON.parse(jsonString);

  packageJsonFile.name = name;
  packageJsonFile.version = '1.0.0';

  const packageJsonFileString = JSON.stringify(packageJsonFile, null, 2);
  fs.writeFileSync(filePath, packageJsonFileString);
};
