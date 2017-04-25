/* @flow */

/* Internal dependencies */
import { transformModifiers } from '../lib/transform-data';
import getNextIdNumber from '../lib/id-generator';

const defineChange = (sequelize: Sequelize, DataTypes: DataTypes) => {
    const changeModel = sequelize.define('Change', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        parentId: DataTypes.BIGINT,
        changeType: DataTypes.STRING,
        iconName: DataTypes.STRING,
        title: DataTypes.STRING,
        details: DataTypes.STRING,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
    }, {
        tableName: 'changes',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                changeModel.belongsTo(models.Lead, {
                    foreignKey: 'parentId',
                    onDelete: 'CASCADE',
                });
            },
        },
        hooks: {
            beforeCreate: change => new Promise((resolve, reject) => {
                getNextIdNumber(changeModel)
                    .then((nextId) => {
                        change.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
        },
    });
    return changeModel;
};

export default defineChange;