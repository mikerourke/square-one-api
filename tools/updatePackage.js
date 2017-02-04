/**
 * Writes the contents of the development package.json to the production
 *      package.json and ignores items not required for release.
 */
import fs from 'fs';
import path from 'path';
const developmentPackage = require('../package.json');

let productionPackage = {
    main: 'bin/www.js',
};

Object.keys(developmentPackage).map(lineItem => {
    switch (lineItem) {
        // These are the keys needed in the production package.json.
        case "name":
        case "description":
        case "version":
        case "engines":
        case "author":
        case "license":
        case "dependencies":
            productionPackage[lineItem] = developmentPackage[lineItem];
            break;
            
        default:
            break;
    }
});

const fileToWrite = path.resolve(__dirname, '..', 'production/package.json');
const contentToWrite = JSON.stringify(productionPackage, null, 2);
fs.writeFile(fileToWrite, contentToWrite, (error) => {
    if (error) {
        return console.log(error);
    }
    return console.log('Production package.json file successfully created.');
});