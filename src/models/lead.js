import getNextIdNumber from '../lib/id-generator';

export default (sequelize, DataTypes) =>
    sequelize.define('Lead', {
        id: {
            type: DataTypes.INTEGER,
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
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'leads',
        freezeTableName: true,
        hooks: {
            beforeCreate: (lead, options) => new Promise((resolve, reject) => {
                getNextIdNumber(101, 'Lead')
                    .then((nextId) => {
                        lead.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
        },
    });