export default (sequelize, DataTypes) => {
    const Setting = sequelize.define('Setting', {
        category: DataTypes.STRING,
        groupName: DataTypes.STRING,
        data: DataTypes.JSONB,
    }, {
        tableName: 'settings',
        freezeTableName: true,
    });
    return Setting;
};