import getNextIdNumber from '../lib/id-generator';

export default (sequelize, DataTypes) => {
    const Change = sequelize.define('Change', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        parentId: DataTypes.BIGINT,
        changeType: DataTypes.STRING,
        iconName: DataTypes.STRING,
        title: DataTypes.STRING,
        details: DataTypes.STRING,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'changes',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                Change.belongsTo(models.Lead, {
                    foreignKey: 'parentId',
                    onDelete: 'CASCADE',
                });
            },
        },
        hooks: {
            beforeCreate: (change, options) => {
                change.id = 10100000;
            },
        },
    });
    return Change;
}