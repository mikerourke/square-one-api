/* @flow */

const defineSetting = (sequelize: Sequelize, DataTypes: DataTypes) =>
    sequelize.define('Setting', {
        category: DataTypes.STRING,
        settingName: DataTypes.STRING,
        data: DataTypes.JSONB,
    }, {
        tableName: 'settings',
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['settingName'],
            },
        ],
    });

export default defineSetting;