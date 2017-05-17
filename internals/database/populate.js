/* Internal dependencies */
const db = require('../../src/models');
const data = require('./data.json');

const { Setting, User } = db;

/**
 * Populate the settings table in the database.
 * @returns {Promise}
 */
const addSettings = () => new Promise((resolve, reject) => {
  const settingsToAdd = data.settings;
  Setting.bulkCreate(settingsToAdd)
    .then(() => resolve())
    .catch(error => reject(new Error(error)));
});

/**
 * Add the admin user to the users table in the database.
 * @returns {Promise}
 */
const addAdminUser = () => new Promise((resolve, reject) => {
  const adminUserToAdd = data.users[0];
  User.create(adminUserToAdd)
    .then(() => resolve())
    .catch(error => reject(new Error(error)));
});

/**
 * Populate the users table in the database.
 * @returns {Promise}
 */
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
