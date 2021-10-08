const fs = require('fs');

module.exports = (projectName) => {
  const ROOT_FILE = `${projectName}/package.json`;
  const API_FILE = `${projectName}/packages/api/package.json`;
  const FRONTEND_FILE = `${projectName}/packages/frontend/package.json`;

  // Root package.json.
  const rootString = fs.readFileSync(ROOT_FILE);
  const rootFile = JSON.parse(rootString);

  rootFile.name = projectName;
  rootFile.version = '1.0.0';

  const adminCreateCommand = rootFile.scripts['create-super-admin'];
  rootFile.scripts['create-super-admin'] = adminCreateCommand.replace('orca-api', 'api');

  delete rootFile.repository;
  delete rootFile.bugs;

  const rootFileString = JSON.stringify(rootFile, null, 2);
  fs.writeFileSync(ROOT_FILE, rootFileString);

  // api package.json.
  const apiString = fs.readFileSync(API_FILE);
  const apiFile = JSON.parse(apiString);

  apiFile.name = 'api';
  apiFile.version = '1.0.0';

  delete apiFile.repository;

  const apiFileString = JSON.stringify(apiFile, null, 2);
  fs.writeFileSync(API_FILE, apiFileString);

  // frontend package.json.
  const frontendString = fs.readFileSync(FRONTEND_FILE);
  const frontendFile = JSON.parse(frontendString);

  frontendFile.name = 'frontend';
  frontendFile.version = '1.0.0';

  const startCommand = frontendFile.scripts.start;
  frontendFile.scripts.start = startCommand.replace('4001', '3000');

  delete frontendFile.repository;

  const frontendFileString = JSON.stringify(frontendFile, null, 2);
  fs.writeFileSync(FRONTEND_FILE, frontendFileString);
};
