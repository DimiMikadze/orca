'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const program = require('commander');
const spawn = require('cross-spawn');
const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');

const validateAppName = require('./utils/validateAppName');
const cloneRepository = require('./utils/cloneRepository');
const updatePackageJsonName = require('./utils/updatePackageJsonName');
const cleanUpPackageJson = require('./utils/cleanUpPackageJson');
const updateSiteInfoName = require('./utils/updateSiteInfoName');
const tryGitInit = require('./utils/tryGitInit');
const isYarnInstalled = require('./utils/isYarnInstalled');

const packageJson = require('./package.json');

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

const createApp = () => {
  validateAppName(projectName, program);

  // Clone template from github
  if (!cloneRepository(projectName)) {
    console.log();
    console.log(chalk.red('Error: Cloning of the repository failed.'));
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

  // Update site name in SiteInfo file
  updateSiteInfoName(projectName);

  // Clean up the root package.json file
  cleanUpPackageJson(`${projectName}/package.json`);

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

  // Remove LICENSE.md, CONTRIBUTING.md and similar files
  rimraf.sync(`${projectName}/LICENSE.md`);
  rimraf.sync(`${projectName}/CONTRIBUTING.md`);
  rimraf.sync(`${projectName}/.prettierrc`);
  rimraf.sync(`${projectName}/.github`);
  rimraf.sync(`${projectName}/CODE_OF_CONDUCT.md`);

  // Try to initialize new git repository
  if (tryGitInit(projectName)) {
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
