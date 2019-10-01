'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const program = require('commander');
const spawn = require('cross-spawn');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');

const validateAppName = require('./utils/validateAppName');
const updatePackageJsonName = require('./utils/updatePackageJsonName');

const packageJson = require('./package.json');

/**
 * App/Template's github url to clone
 */
const APP_GITHUB_URL = 'https://github.com/udilia/create-social-network';

let projectName;

program
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')}`)
  .action(name => {
    projectName = name;
  })
  .on('--help', () => {
    console.log();
    console.log(`Only ${chalk.green('<project-directory>')} is required.`);
  });

program.parse(process.argv);

function isYarnInstalled() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit() {
  let didInit = false;

  try {
    execSync('git --version', { stdio: 'ignore' });
    execSync('git init', { cwd: projectName, stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { cwd: projectName, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Create Social Network"', {
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
}

const createApp = () => {
  validateAppName(projectName, program);

  // Clone template from github
  const root = path.resolve(projectName);
  console.log();
  console.log(`Creating a new Social Network in ${chalk.green(root)}`);
  console.log();
  const clone = spawn.sync('git', ['clone', APP_GITHUB_URL, projectName], {
    stdio: 'inherit',
  });
  if (clone.status !== 0) {
    console.log();
    console.log(chalk.red('Error: Cloning of the project failed.'));
    process.exit(1);
  }

  // Update package.json file names with projectName
  updatePackageJsonName(`${projectName}/package.json`, projectName);
  updatePackageJsonName(
    `${projectName}/api/package.json`,
    `${projectName}-api`
  );
  updatePackageJsonName(
    `${projectName}/frontend/package.json`,
    `${projectName}-frontend`
  );

  // Choose which package manger to use
  const packageManager = isYarnInstalled() ? 'yarn' : 'npm';

  // Install dependencies
  console.log();
  console.log('Installing dependencies');
  console.log();
  // Since npm doesn't support workspaces, we need to separately install dependencies
  if (packageManager === 'npm') {
    spawn.sync('npm', ['install'], { cwd: `${projectName}`, stdio: 'inherit' });
    spawn.sync('npm', ['install'], {
      cwd: `${projectName}/api`,
      stdio: 'inherit',
    });
    spawn.sync('npm', ['install'], {
      cwd: `${projectName}/frontend`,
      stdio: 'inherit',
    });
  } else {
    spawn.sync('yarn', { cwd: `${projectName}`, stdio: 'inherit' });
  }

  // Rename .env.examples to .env
  fs.renameSync(`${projectName}/api/.env.example`, `${projectName}/api/.env`);
  fs.renameSync(
    `${projectName}/frontend/.env.example`,
    `${projectName}/frontend/.env`
  );

  // Remove .git and lib
  rimraf.sync(`${projectName}/.git`);
  rimraf.sync(`${projectName}/lib`);

  // Remove LICENSE file
  rimraf.sync(`${projectName}/LICENSE.md`);

  // Try to initialize new git repository
  if (tryGitInit()) {
    console.log();
    console.log('Initialized a git repository.');
  }

  // Success
  console.log();
  console.log(
    chalk.green('Success!'),
    `Created ${projectName} at ${process.cwd()}`
  );
  console.log();

  console.log(
    `To start the application, ${chalk.cyan(
      'cd'
    )} inside the newly created project and run ${chalk.cyan(
      packageManager + ' start'
    )} `
  );
  console.log();
  console.log(chalk.cyan(`    cd ${projectName}`));
  console.log(chalk.cyan(`    ${packageManager} start`));
  console.log();
};

createApp();
