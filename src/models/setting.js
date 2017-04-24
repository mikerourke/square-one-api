const settingModel = (sequelize, DataTypes) =>
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

export default settingModel;