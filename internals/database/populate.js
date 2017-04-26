/* Internal dependencies */
import db from '../../src/models';
const data = require('./data.json');

const { Setting, User } = db;

const addSettings = () => new Promise((resolve, reject) => {
    const settingsToAdd = data.settings;
    Setting.bulkCreate(settingsToAdd)
        .then(() => resolve())
        .catch(error => reject(`Error adding settings: ${error}`));
});

const addUsers = () => new Promise((resolve, reject) => {
    const usersToAdd = data.users;
    User.bulkCreate(usersToAdd)
        .then(() => resolve())
        .catch(error => reject(`Error adding users: ${error}`));
});

db.sequelize.sync()
    // .then(addSettings)
    .then(addUsers)
    .then(() => console.log('Done'))
    .catch(error => console.error(error));