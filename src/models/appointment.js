export default (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
        subject: DataTypes.STRING,
        startAt: DataTypes.DATE,
        endAt: DataTypes.DATE,
        appointmentFor: DataTypes.STRING,
        emailAlert: DataTypes.INTEGER,
        isAllDay: DataTypes.BOOLEAN,
    }, {
        tableName: 'appointments',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                Appointment.belongsTo(models.Lead, {
                    foreignKey: 'leadId',
                    onDelete: 'CASCADE',
                });
            },
        },
    });
    return Appointment;
};