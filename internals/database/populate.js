/* Internal dependencies */
import db from '../../src/models';
const data = require('./data.json');

const { Setting, User } = db;

const addSettings = () => new Promise((resolve, reject) => {
    const settingsToAdd = data.settings;
    Setting.bulkCreate(settingsToAdd)
        .then(() => resolve())
        .catch(err => reject(`err adding settings: ${err}`));
});

const addAdminUser = () => new Promise((resolve, reject) => {
    const adminUserToAdd = data.users[0];
    User.create(adminUserToAdd)
        .then(() => resolve())
        .catch(err => reject(`err adding admin user: ${err}`));
});

const addUsers = () => new Promise((resolve, reject) => {
    const usersToAdd = data.users;
    User.bulkCreate(usersToAdd)
        .then(() => resolve())
        .catch(err => reject(`err adding users: ${err}`));
});

db.sequelize.sync()
    .then(addSettings)
    .then(addAdminUser)
    .then(addUsers)
    .then(() => console.log('Done'))
    .catch(err => console.err(err));
