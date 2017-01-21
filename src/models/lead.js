/**
 * Sequelize model that represents a Lead entity.
 */
export default (sequelize, DataTypes) => {
    const Lead = sequelize.define('Lead', {
        name: DataTypes.STRING,
        source: DataTypes.STRING,
        leadFee: DataTypes.FLOAT,
        phone: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: { isEmail: true },
        },
        address: DataTypes.STRING,
        notes: DataTypes.JSONB,
        notifications: DataTypes.JSONB,
    }, {
        tableName: 'leads',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                Lead.hasMany(models.Appointment, {
                    foreignKey: 'leadId',
                    as: 'appointments',
                });
            },
        },
    });
    return Lead;
};
