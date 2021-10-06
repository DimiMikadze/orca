const execSync = require('child_process').execSync;
const rimraf = require('rimraf');

module.exports = (projectName) => {
  let didInit = false;

  try {
    execSync('git --version', { stdio: 'ignore' });
    execSync('git init', { cwd: projectName, stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { cwd: projectName, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Orca"', {
      cwd: projectName,
      stdio: 'ignore',
    });
  } catch (error) {
    if (didInit) {
      // If we successfully initialized but couldn't commit, maybe the commit author config is not set.
      try {
        rimraf.sync(`${projectName}/.git`);
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false;
  }
};
