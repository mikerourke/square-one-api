/* Internal dependencies */
import db from '../../src/models';
const data = require('./data.json');

const { Setting, User } = db;

const addSettings = () => new Promise((resolve, reject) => {
    const settingsToAdd = data.settings;
    Setting.bulkCreate(settingsToAdd)
        .then(() => resolve())
        .catch(error => reject(new Error(error)));
});

const addAdminUser = () => new Promise((resolve, reject) => {
    const adminUserToAdd = data.users[0];
    User.create(adminUserToAdd)
        .then(() => resolve())
        .catch(error => reject(new Error(error)));
});

const addUsers = () => new Promise((resolve, reject) => {
    const usersToAdd = data.users;
    User.bulkCreate(usersToAdd)
        .then(() => resolve())
        .catch(error => reject(new Error(error)));
});

db.sequelize.sync()
    .then(addSettings)
    .then(addAdminUser)
    .then(addUsers)
    .then(() => console.log('Done'))
    .catch(error => console.error(error));
