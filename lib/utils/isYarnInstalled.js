const execSync = require('child_process').execSync;

/**
 * Checks if Yarn is installed on users computer
 */
module.exports = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};
