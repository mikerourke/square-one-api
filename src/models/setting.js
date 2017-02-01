/**
 * Sequelize model that represents a Setting entity.
 */
export default (sequelize, DataTypes) => {
    const Setting = sequelize.define('Setting', {
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
    return Setting;
};
