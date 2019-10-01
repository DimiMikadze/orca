const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const { appDependencies } = require('./appDependencies');

/**
 * Validates project name
 *
 * @param {string} projectName
 * @param {obj} program
 */
module.exports = (projectName, program) => {
  // Check if project name isn't empty
  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log('For example:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('my-social-network')}`
    );
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  // Helper functions that prints NPM name validation errors
  const printValidationResults = results => {
    if (typeof results !== 'undefined') {
      results.forEach(error => {
        console.error(chalk.red(`  *  ${error}`));
      });
    }
  };

  // Check NPM Name validity
  const validationResult = validateProjectName(projectName);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }

  // Check if projectName doesn't match with dependency names
  const dependencies = appDependencies.sort();
  if (dependencies.indexOf(projectName) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(
          projectName
        )} because a dependency with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
        chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
        chalk.red('\n\nPlease choose a different project name.')
    );
    process.exit(1);
  }
};
