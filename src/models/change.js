import getNextIdNumber from '../lib/id-generator';

export default (sequelize, DataTypes) =>
    sequelize.define('Change', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        changeType: DataTypes.STRING,
        iconName: DataTypes.STRING,
        title: DataTypes.STRING,
        details: DataTypes.STRING,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'changes',
        freezeTableName: true,
        hooks: {
            beforeCreate: (change, options) => {
                change.id = 10100000;
            },
        },
    });