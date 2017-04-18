/* External dependencies */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

/* Internal dependencies */
const developmentPackage = require('../../package.json');
const rootPath = path.resolve(process.cwd());

/**
 * Deletes all the JavaScript files from the "production" directory.
 */
const clearProductionFolder = () => new Promise((resolve) => {
    // TODO: Check this for Windows file path.
    shell.cd(`${rootPath}/production`);
    const jsFiles = shell.find('.').filter(file => file.match(/\.js$/));
    shell.rm(jsFiles);
    resolve();
});

/**
 * Creates a package.json file for the production release.
 */
const createProductionPackageFile = () =>
    new Promise((resolve, reject) => {
    const productionPackage = {
        main: 'bin/www.js',
    };

    Object.keys(developmentPackage).forEach((lineItem) => {
        switch (lineItem) {
            // These are the keys needed in the production package.json.
            case 'name':
            case 'description':
            case 'version':
            case 'engines':
            case 'author':
            case 'license':
            case 'dependencies':
                productionPackage[lineItem] = developmentPackage[lineItem];
                break;
            default:
                break;
        }
    });

    const fileToWrite = path.resolve(rootPath, 'production/package.json');
    const contentToWrite = JSON.stringify(productionPackage, null, 2);
    fs.writeFile(fileToWrite, contentToWrite, (error) => {
        if (error) {
            reject(error);
        }
        console.log('Production package.json file successfully created.');
        resolve();
    });
});

updateClientFolder();