const fs = require('fs');

/**
 * Cleans up the root package.json file
 *
 * @param {string} filePath
 */
module.exports = filePath => {
  const jsonString = fs.readFileSync(filePath);
  const packageJsonFile = JSON.parse(jsonString);

  // Delete format key from scripts
  delete packageJsonFile.scripts.format;

  // Delete repository and bugs url
  delete packageJsonFile.repository;
  delete packageJsonFile.bugs;

  // Delete husky lint-staged and prettier from devDependencies
  delete packageJsonFile.devDependencies.husky;
  delete packageJsonFile.devDependencies['lint-staged'];
  delete packageJsonFile.devDependencies.prettier;

  // Delete husky, lint-staged, engines and license key
  delete packageJsonFile.husky;
  delete packageJsonFile['lint-staged'];
  delete packageJsonFile.engines;
  delete packageJsonFile.license;

  // Write file
  const packageJsonFileString = JSON.stringify(packageJsonFile, null, 2);
  fs.writeFileSync(filePath, packageJsonFileString);
};
