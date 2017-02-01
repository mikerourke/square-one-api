/**
 * Sequelize model that represents a User entity.
 */
export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        title: DataTypes.STRING,
        isLoggedIn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: 'users',
        freezeTableName: true,
        indexes: [
            {
                unique: true,
                fields: ['username'],
            },
        ],
    });
    return User;
};
