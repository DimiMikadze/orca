const fs = require('fs');

module.exports = (filePath) => {
  const jsonString = fs.readFileSync(filePath);
  const pm2ConfigFile = JSON.parse(jsonString);

  // Edit API name and CWD.
  const apiConfigName = pm2ConfigFile.apps[0].name;
  const apiConfigCwd = pm2ConfigFile.apps[0].cwd;
  pm2ConfigFile.apps[0].name = apiConfigName.replace('orca-api', 'api');
  pm2ConfigFile.apps[0].cwd = apiConfigCwd.replace('orca-api', 'api');

  // Edit Frontend name and CWD.
  const frontendConfigName = pm2ConfigFile.apps[1].name;
  const frontendConfigCwd = pm2ConfigFile.apps[1].cwd;
  pm2ConfigFile.apps[1].name = frontendConfigName.replace('orca-frontend', 'frontend');
  pm2ConfigFile.apps[1].cwd = frontendConfigCwd.replace('orca-frontend', 'frontend');

  const pm2ConfigFileString = JSON.stringify(pm2ConfigFile, null, 2);
  fs.writeFileSync(filePath, pm2ConfigFileString);
};
