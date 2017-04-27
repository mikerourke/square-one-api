/* @flow */

/**
 * Validation object for email fields in the database.
 */
export const getEmailValidation = (DataTypes: DataTypes) => ({
    type: DataTypes.STRING,
    allowNull: false,
    set: function set(value: string) {
        this.setDataValue('email', value.toLowerCase());
    },
    validate: {
        isEmail: true,
        notEmpty: true,
        len: [1, 255],
    },
});

/**
 * Validation object for phone number fields in the database.
 */
export const getPhoneValidation = (DataTypes: DataTypes) => ({
    type: DataTypes.STRING,
    validate: {
        not: ['[a-z]', 'i'],
        notEmpty: true,
        len: [10],
    },
});