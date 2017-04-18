// TODO: Create ID generation code.
// http://stackoverflow.com/questions/24131359/how-do-i-create-custom-sequence-in-postgresql-based-on-date-of-row-creation

/* External dependencies */
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

/* Internal dependencies */
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);

fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) &&
               (file !== path.basename(module.filename)) &&
               (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
