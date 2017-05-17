/* @flow */

/* External dependencies */
import bcrypt from 'bcrypt';

/* Internal dependencies */
import {
  getEmailAttribute,
  getPhoneAttribute,
} from '../lib/attributes';

/**
 * Ensures the password the user enters if secure.
 */
const checkForSecurePassword = (user, options): Promise<*> =>
  new Promise((resolve, reject) => {
    if (user.password) {
      if (user.password !== user.passwordConfirmation) {
        reject(new Error("Confirmation doesn't match password"));
      }
      bcrypt.hash(user.get('password'), 10, (error, hash) => {
        if (error) {
          reject(new Error(error));
        }
        user.set('passwordDigest', hash);
        resolve(options);
      });
    } else {
      reject(new Error('No password found.'));
    }
  });

export default function defineUser(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  return sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 15],
      },
    },
    fullName: DataTypes.STRING,
    phone: getPhoneAttribute.call(this, DataTypes),
    email: getEmailAttribute.call(this, DataTypes),
    title: DataTypes.STRING,
    role: DataTypes.ENUM(
      'admin',
      'office',
      'representative',
      'field',
      'manager',
    ),
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, Infinity],
      },
    },
    passwordConfirmation: DataTypes.VIRTUAL,
  }, {
    tableName: 'users',
    freezeTableName: true,
    hooks: {
      beforeCreate: (user, options) => checkForSecurePassword(user, options),
      beforeUpdate: (user, options) => checkForSecurePassword(user, options),
    },
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
    ],
    instanceMethods: {
      authenticate: function authenticate(value) {
        const thisUser = this;
        return new Promise((resolve, reject) => {
          const digest = thisUser.passwordDigest || '';
          bcrypt
            .compare(value, digest)
            .then((result) => {
              if (result) {
                resolve(thisUser);
              } else {
                reject(new Error('Invalid password'));
              }
            })
            .catch(error => reject(new Error(error)));
        });
      },
    },
  });
}
