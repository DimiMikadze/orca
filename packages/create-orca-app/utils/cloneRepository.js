const spawn = require('cross-spawn');
const path = require('path');
const chalk = require('chalk');

const tryGitClone = (url, projectName) => {
  const clone = spawn.sync('git', ['clone', url, projectName], {
    stdio: 'inherit',
  });

  return clone;
};

module.exports = (projectName) => {
  const httpsUrl = 'https://github.com/elevensymbols/orca.git';
  const sshUrl = 'git@github.com:elevensymbols/orca.git';
  const root = path.resolve(projectName);

  console.log();
  console.log(`Creating a new Orca app in ${chalk.green(root)}`);
  console.log();

  // First, try to clone the HTTPS repository since Github recommends it.
  const cloneHttps = tryGitClone(httpsUrl, projectName);
  if (cloneHttps.status === 0) {
    return true;
  }

  // If HTTPS fails try via ssh.
  const cloneSsh = tryGitClone(sshUrl, projectName);
  return cloneSsh.status === 0;
};
