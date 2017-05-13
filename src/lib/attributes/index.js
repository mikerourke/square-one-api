/* @flow */

/**
 * Model attribute for email fields in the database.
 * @param {DataTypes} DataTypes Sequelize DataTypes object.
 * @returns {Object} Column object with validation.
 */
export const getEmailAttribute = (DataTypes: DataTypes): Object => ({
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null,
  set: function set(value: string) {
    if (value) {
      this.setDataValue('email', value.toLowerCase());
    }
  },
  validate: {
    isEmail: true,
    notEmpty: false,
    len: [1, 255],
  },
});

/**
 * Model attribute for phone number fields in the database.
 * @param {DataTypes} DataTypes Sequelize DataTypes object.
 * @returns {Object} Column object with validation.
 */
export const getPhoneAttribute = (DataTypes: DataTypes): Object => ({
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null,
  validate: {
    not: ['[a-z]', 'i'],
    notEmpty: false,
    len: [10],
  },
});