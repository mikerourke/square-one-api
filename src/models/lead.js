export default (sequelize, DataTypes) =>
    sequelize.define('Lead', {
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
    });
