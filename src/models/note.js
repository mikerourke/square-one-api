/* @flow */

/* Internal dependencies */
import getNextIdNumber from '../lib/id-generator';

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    const Note = sequelize.define('Note', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        parentId: DataTypes.BIGINT,
        contents: DataTypes.STRING,
        isPrivate: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'notes',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                Note.belongsTo(models.Lead, {
                    foreignKey: 'parentId',
                    onDelete: 'CASCADE',
                });
            },
        },
        hooks: {
            beforeCreate: note => new Promise((resolve, reject) => {
                getNextIdNumber(Note)
                    .then((nextId) => {
                        note.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
        },
    });
    return Note;
};
