export default (sequelize, DataTypes) =>
    sequelize.define('Note', {
        contents: DataTypes.STRING,
        isPrivate: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'notes',
        freezeTableName: true,
    });
