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
    shell.cd(`${rootPath}/production`);
    const jsFiles = shell.find('.').filter(file => file.match(/\.js$/));
    shell.rm(jsFiles);
    resolve();
});

/**
 * Creates a package.json file for the production release.
 */
const createProductionPackageFile = () => new Promise((resolve, reject) => {
    const productionPackage = {};

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

    productionPackage.scripts = {
        start: 'node --require dotenv/config ./bin/www.js',
    };

    const fileToWrite = path.resolve(rootPath, 'production/package.json');
    const contentToWrite = JSON.stringify(productionPackage, null, 2);
    fs.writeFile(fileToWrite, contentToWrite, (error) => {
        if (error) {
            reject(new Error(error));
        }
        console.log('Production package.json file successfully created.');
        resolve();
    });
});

const transpileFiles = () => new Promise((resolve, reject) => {
    shell.exec(`babel -d ${rootPath}/production ${rootPath}/src`,
        (code, stdout, stderr) => {
            if (stderr) {
                reject(new Error(stderr));
            }
            resolve();
        })
});

clearProductionFolder()
    .then(transpileFiles)
    .then(createProductionPackageFile)
    .then(() => console.log('All tasks complete.'));