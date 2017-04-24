/* External dependencies */
import bcrypt from 'bcrypt';


const checkForSecurePassword = (user, options) =>
    new Promise((resolve, reject) => {
        if (user.password) {
            if (user.password !== user.passwordConfirmation) {
                reject("Password confirmation doesn't match Password");
            }
            bcrypt.hash(user.get('password'), 10, (err, hash) => {
                if (err) {
                    reject(err);
                }
                user.set('passwordDigest', hash);
                resolve(options);
            });
        } else {
            reject('No password found.');
        }
    });

const userModel = (sequelize, DataTypes) =>
    sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 15],
            },
        },
        fullName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            set: function set(value) {
                this.setDataValue('email', value.toLowerCase());
            },
            validate: {
                isEmail: true,
                notEmpty: true,
                len: [1, 255],
            },
        },
        title: DataTypes.STRING,
        isLoggedIn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        accessLevel: DataTypes.STRING,
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
            beforeCreate: (user, options) => {
                return checkForSecurePassword(user, options);
            },

            beforeUpdate: (user, options) => {
                return checkForSecurePassword(user, options);
            },
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
                    if (bcrypt.compare(value, digest)) {
                        resolve(thisUser);
                    } else {
                        reject('Invalid password');
                    }
                });
            },
        },
    });

export default userModel;