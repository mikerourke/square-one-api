/* @flow */

/* Internal dependencies */
import { getTransformedModifiers } from '../lib/entity-modifications';
import getNextIdNumber from '../lib/id-generator';

const defineNote = (sequelize: Sequelize, DataTypes: DataTypes) => {
    const noteModel = sequelize.define('Note', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        parentId: DataTypes.BIGINT,
        contents: DataTypes.STRING,
        isPrivate: DataTypes.BOOLEAN,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
    }, {
        tableName: 'notes',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                noteModel.belongsTo(models.Lead, {
                    foreignKey: 'parentId',
                    onDelete: 'CASCADE',
                });
            },
        },
        hooks: {
            beforeCreate: note => new Promise((resolve, reject) => {
                getNextIdNumber(noteModel)
                    .then((nextId) => {
                        note.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
            afterCreate: note => getTransformedModifiers(note),
            afterFind: result => getTransformedModifiers(result),
        },
        scopes: {
            inParent: parentId => ({ where: { parentId } }),
        },
    });
    return noteModel;
};

export default defineNote;