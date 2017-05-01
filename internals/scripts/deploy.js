// TODO: Finish deployment code.

/* External dependencies */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const rootPath = path.resolve(process.cwd());
const productionPath = `${rootPath}/production`;

const commitChanges = () => {
    shell.cd(productionPath);
    shell.exec('git add .');
    shell.exec('git commit -a -m "Automated deployment"');
};

