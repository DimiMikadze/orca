const spawn = require('cross-spawn');
const path = require('path');
const chalk = require('chalk');

// Git clone helper
const tryGitClone = (url, projectName) => {
  const clone = spawn.sync('git', ['clone', url, projectName], {
    stdio: 'inherit',
  });

  return clone;
};

/**
 * Clones the create-social-network repository
 *
 * @param {string} projectName
 */
module.exports = projectName => {
  const httpsUrl = 'https://github.com/dimimikadze/create-social-network.git';
  const sshUrl = 'git@github.com:dimimikadze/create-social-network.git';
  const root = path.resolve(projectName);

  console.log();
  console.log(`Creating a new Social Network in ${chalk.green(root)}`);
  console.log();

  // First try to clone https repository, since it is recommended by Github
  const cloneHttps = tryGitClone(httpsUrl, projectName);
  if (cloneHttps.status === 0) {
    return true;
  }

  // If we couldn't managed to clone repository via https, try with ssh
  const cloneSsh = tryGitClone(sshUrl, projectName);
  return cloneSsh.status === 0;
};
