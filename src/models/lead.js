/* @flow */

/* Internal dependencies */
import getNextIdNumber from '../lib/id-generator';

const defineLead = (sequelize: Sequelize, DataTypes: DataTypes) => {
    const leadModel = sequelize.define('Lead', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        leadName: DataTypes.STRING,
        contactName: DataTypes.STRING,
        source: DataTypes.STRING,
        leadFee: DataTypes.FLOAT,
        phone: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: { isEmail: true },
        },
        address: DataTypes.STRING,
        lat: DataTypes.DECIMAL,
        lng: DataTypes.DECIMAL,
        description: DataTypes.STRING,
        status: DataTypes.STRING,
        assignTo: DataTypes.STRING,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
    }, {
        tableName: 'leads',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                leadModel.hasMany(models.Change, {
                    foreignKey: 'parentId',
                    as: 'changes',
                });
                leadModel.hasMany(models.Message, {
                    foreignKey: 'parentId',
                    as: 'messages',
                });
                leadModel.hasMany(models.Note, {
                    foreignKey: 'parentId',
                    as: 'notes',
                });
            },
        },
        hooks: {
            beforeCreate: lead => new Promise((resolve, reject) => {
                getNextIdNumber(leadModel)
                    .then((nextId) => {
                        lead.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
        },
    });
    return leadModel;
};

export default defineLead;