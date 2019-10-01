const fs = require('fs');

/**
 * Converts projectName to Display Name
 */
const toDisplayName = projectName => {
  const splitString = projectName
    .replace(/-/g, ' ')
    .toLowerCase()
    .split(' ');

  for (var i = 0; i < splitString.length; i++) {
    splitString[i] =
      splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);
  }

  return splitString.join(' ');
};

/**
 * Updates name value in SiteInfo file
 */
module.exports = projectName => {
  const displayName = toDisplayName(projectName);
  const filePath = `${projectName}/frontend/src/constants/SiteInfo.json`;

  const jsonString = fs.readFileSync(filePath);
  const siteInfoFile = JSON.parse(jsonString);

  siteInfoFile.name = displayName;

  const siteInfoFileString = JSON.stringify(siteInfoFile, null, 2);
  fs.writeFileSync(filePath, siteInfoFileString);
};
