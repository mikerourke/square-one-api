/* @flow */

/* Internal dependencies */
import { getTransformedModifiers } from '../lib/entity-modifications';
import { getPhoneAttribute } from '../lib/attributes';
import getNextIdNumber from '../lib/id-generator';
import sendTextMessages from '../lib/text-message';

const getPrefix = () => '103';

const sendMessagesHook = (messages: Array<Object>): Promise<*> =>
  new Promise((resolve, reject) => {
    const messagesToSend = messages.map(message => ({
      body: message.body,
      to: message.recipient,
    }));
    sendTextMessages(messagesToSend)
      .then(() => resolve())
      .catch(error => reject(new Error(error)));
  });

export default function defineMessage(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const messageModel = sequelize.define('Message', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    parentId: DataTypes.BIGINT,
    messageType: {
      type: DataTypes.STRING,
      defaultValue: 'text',
    },
    recipient: getPhoneAttribute.call(this, DataTypes),
    subject: DataTypes.STRING,
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
  }, {
    tableName: 'messages',
    freezeTableName: true,
    classMethods: {
      getPrefix,
      associate: (models) => {
        messageModel.belongsTo(models.Lead, {
          foreignKey: 'parentId',
          onDelete: 'CASCADE',
        });
      },
    },
    hooks: {
      // FIXME: Address if text messaging isn't working.
      beforeBulkCreate: messages => new Promise((resolve, reject) => {
        sendMessagesHook(messages)
          .then(() => {
            getNextIdNumber(messageModel)
              .then((nextId) => {
                let messageId = nextId;
                messages.forEach((message) => {
                  message.id = messageId;
                  messageId += 1;
                });
                resolve();
              })
              .catch(error => reject(new Error(error)));
          })
          .catch(error => reject(new Error(error)));
      }),
      afterBulkCreate: messages => getTransformedModifiers(messages),
      afterFind: result => getTransformedModifiers(result),
    },
    instanceMethods: {
      getPrefix,
    },
    scopes: {
      inParent: parentId => ({ where: { parentId } }),
    },
  });
  return messageModel;
}