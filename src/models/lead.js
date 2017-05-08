/* @flow */

/* Internal dependencies */
import { getTransformedModifiers } from '../lib/entity-modifications';
import {
    getEmailAttribute,
    getPhoneAttribute,
} from '../lib/attributes';
import getNextIdNumber from '../lib/id-generator';

const getPrefix = () => '101';

export default function defineLead(
    sequelize: Sequelize,
    DataTypes: DataTypes,
) {
    const leadModel = sequelize.define('Lead', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        leadName: DataTypes.STRING,
        contactName: DataTypes.STRING,
        source: DataTypes.STRING,
        leadFee: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        phone: getPhoneAttribute.call(this, DataTypes),
        email: getEmailAttribute.call(this, DataTypes),
        address: DataTypes.STRING,
        lat: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
        },
        lng: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
        },
        description: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'New',
        },
        assignTo: DataTypes.STRING,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
    }, {
        tableName: 'leads',
        freezeTableName: true,
        classMethods: {
            getPrefix,
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
                    .catch(error => reject(new Error(error)));
            }),
            afterCreate: lead => getTransformedModifiers(lead),
            afterFind: result => getTransformedModifiers(result),
        },
        instanceMethods: {
            getPrefix,
        },
    });
    return leadModel;
}