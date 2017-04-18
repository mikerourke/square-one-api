export default (sequelize, DataTypes) =>
    sequelize.define('Change', {
        changeType: DataTypes.STRING,
        iconName: DataTypes.STRING,
        title: DataTypes.STRING,
        details: DataTypes.STRING,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'changes',
        freezeTableName: true,
    });