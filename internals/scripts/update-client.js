/* External dependencies */
const { red, blue, green } = require('chalk');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const serverPath = '~/Repositories/square-one-api';
const webPath = '~/Repositories/square-one';

/**
 * Deletes the "client" folder in the "src" directory (used for testing).
 */
const removeExistingClient = () => new Promise((resolve, reject) => {
    const serverClientPath = `${serverPath}/client`;
    shell.rm('-rf', serverClientPath);
    shell.mkdir(serverClientPath);
    if (shell.test('-d', serverClientPath)) {
        console.log(green('Existing client path deleted.'));
        resolve();
    } else {
        reject('Error removing existing client');
    }
});

/**
 * If the "client" folder in the web application hasn't been created, run
 *      the Webpack build process.
 */
const buildClientIfRequired = () => new Promise((resolve, reject) => {
    if (!shell.test('-d', `${webPath}/client`)) {
        shell.cd(webPath);
        shell.exec('npm run build', (code, stdout, stderr) => {
            if (stderr) {
                reject('Error occurred: ' + stderr);
            }
            console.log(green('Files successfully transpiled.'));
            resolve();
        })
    } else {
        resolve();
    }
});

/**
 * Copies the build "client" folder from the web application to the "src"
 *      directory.
 */
const copyClientToSrc = () => new Promise((resolve, reject) => {
    const sourcePath = `${webPath}/client`;
    const targetPath = `${serverPath}/src`;
    shell.cp('-r', sourcePath, targetPath);
    if (shell.test('-d', targetPath)) {
        console.log(green('Client folder successfully copied.'));
        resolve();
    } else {
        reject('Error creating client folder.');
    }
});

removeExistingClient()
    .then(buildClientIfRequired)
    .then(copyClientToSrc)
    .then(() => console.log(blue('Client update complete.')))
    .catch(error => console.log(red('Error occurred: ' + error)));