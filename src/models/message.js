export default (sequelize, DataTypes) =>
    sequelize.define('Message', {
        messageType: DataTypes.STRING,
        recipient: DataTypes.STRING,
        subject: DataTypes.STRING,
        body: DataTypes.STRING,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'messages',
        freezeTableName: true,
    });