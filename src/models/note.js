/* @flow */

/* Internal dependencies */
import { getTransformedModifiers } from '../lib/entity-modifications';
import getNextIdNumber from '../lib/id-generator';

const getPrefix = () => '104';

export default function defineNote(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const noteModel = sequelize.define('Note', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    parentId: DataTypes.BIGINT,
    contents: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
  }, {
    tableName: 'notes',
    freezeTableName: true,
    classMethods: {
      getPrefix,
      associate: (models) => {
        noteModel.belongsTo(models.Lead, {
          foreignKey: 'parentId',
          onDelete: 'CASCADE',
        });
      },
    },
    getterMethods: {
      prefix: () => '104',
    },
    hooks: {
      beforeCreate: note => new Promise((resolve, reject) => {
        getNextIdNumber(noteModel)
          .then((nextId) => {
            note.id = nextId;
            resolve();
          })
          .catch(error => reject(new Error(error)));
      }),
      afterCreate: note => getTransformedModifiers(note),
      afterFind: result => getTransformedModifiers(result),
    },
    instanceMethods: {
      getPrefix,
    },
    scopes: {
      inParent: parentId => ({ where: { parentId } }),
    },
  });
  return noteModel;
}