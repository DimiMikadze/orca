'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const program = require('commander');
const spawn = require('cross-spawn');
const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');

const validateAppName = require('./utils/validateAppName');
const cloneRepository = require('./utils/cloneRepository');
const updatePackageJsonFiles = require('./utils/updatePackageJsonFiles');
const tryGitInit = require('./utils/tryGitInit');
const isYarnInstalled = require('./utils/isYarnInstalled');
const updatePm2ConfigFile = require('./utils/updatePm2ConfigFile');
const updateCreateSuperAdminScript = require('./utils/updateCreateSuperAdminScript');
const editFrontEndConfig = require('./utils/editFrontEndConfig');

const packageJson = require('./package.json');

let projectName;

program
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')}`)
  .action((name) => {
    projectName = name;
  })
  .on('--help', () => {
    console.log();
    console.log(`Only ${chalk.green('<project-directory>')} is required.`);
  });

program.parse(process.argv);

const createApp = () => {
  validateAppName(projectName, program);

  // Clone the repository from Github.
  if (!cloneRepository(projectName)) {
    console.log();
    console.log(chalk.red('An error occurred while cloning the repository from Github.'));
    process.exit(1);
  }

  // Rename package directory names.
  fs.renameSync(`${projectName}/packages/orca-api`, `${projectName}/packages/api`);
  fs.renameSync(`${projectName}/packages/orca-frontend`, `${projectName}/packages/frontend`);

  // Update the project package.json files.
  updatePackageJsonFiles(projectName);

  // Clean up the pm2 configuration file.
  updatePm2ConfigFile(`${projectName}/pm2.config.json`);

  // Update the admin creation script.
  updateCreateSuperAdminScript(`${projectName}/packages/api/createSuperAdmin.js`);

  // Edit the frontend configuration file.
  editFrontEndConfig(`${projectName}/packages/frontend/utils/config.ts`);

  // Check if Yarn is installed.
  if (!isYarnInstalled()) {
    console.log();
    console.log(chalk.red("Error: It seems you don't have Yarn installed on your computer."));
    console.log(chalk.cyan('Please install it, and rerun the Orca installation.'));
    rimraf(projectName);
    process.exit(1);
  }

  // Install dependencies
  console.log();
  console.log('Installing dependencies');
  console.log();

  spawn.sync('yarn', { cwd: `${projectName}`, stdio: 'inherit' });

  // Rename API's .env.example file to .env
  fs.renameSync(`${projectName}/packages/api/.env.example`, `${projectName}/packages/api/.env`);

  // Remove .git, create-orca-app, and scripts directories.
  rimraf.sync(`${projectName}/.git`);
  rimraf.sync(`${projectName}/packages/create-orca-app`);
  rimraf.sync(`${projectName}/scripts`);

  // Remove irrelevant files.
  rimraf.sync(`${projectName}/LICENSE.md`);
  rimraf.sync(`${projectName}/CONTRIBUTING.md`);
  rimraf.sync(`${projectName}/.circleci`);
  rimraf.sync(`${projectName}/.github`);
  rimraf.sync(`${projectName}/CODE_OF_CONDUCT.md`);

  // Try to initialize a new git repository.
  if (tryGitInit(projectName)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  // Success
  console.log();
  console.log(chalk.green('Success!'), `Created ${projectName} at ${process.cwd()}`);
  console.log();

  console.log(
    `To start the application, ${chalk.cyan('cd')} inside the newly created project and run ${chalk.cyan('yarn dev')} `
  );
  console.log();
  console.log(chalk.cyan(`    cd ${projectName}`));
  console.log(chalk.cyan(`    yarn dev`));
  console.log();

  console.log('');
  console.log(
    `To create an initial super admin user, ${chalk.cyan(
      'cd'
    )} inside the newly created project and run the following command with your real email address:`
  );
  console.log('');
  console.log(chalk.cyan(`    cd ${projectName}`));
  console.log(chalk.cyan(`    yarn create-super-admin your@email.com`));
  console.log('');

  console.log('');
  console.log(
    `For CDN, Email service, and Google Analytics configuration, please visit the following URL: ${chalk.cyan(
      'https://dimimikadze.github.io/orca-docs/docs/getting-started/configuration'
    )}`
  );
  console.log('');
};

createApp();
