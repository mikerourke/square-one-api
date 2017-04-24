/* @flow */

/* Internal dependencies */
import getNextIdNumber from '../lib/id-generator';
import { User } from './index';

const changeModel = (sequelize: Sequelize, DataTypes: DataTypes) => {
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
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
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
            beforeCreate: change => new Promise((resolve, reject) => {
                getNextIdNumber(Change)
                    .then((nextId) => {
                        change.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
        },
    });
    return Change;
}

export default changeModel;