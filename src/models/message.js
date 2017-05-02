/* @flow */

/* Internal dependencies */
import { getTransformedModifiers } from '../lib/entity-modifications';
import getNextIdNumber from '../lib/id-generator';
import sendTextMessages from '../lib/text-message';

const assignIdToMessage = (messageModel: Object, messageInstance: Object) =>
    new Promise((resolve, reject) => {
        getNextIdNumber(messageModel)
            .then((nextId) => {
                messageInstance.id = nextId;
                resolve(messageInstance);
            })
            .catch(error => reject(error));
    });

const defineMessage = (sequelize: Sequelize, DataTypes: DataTypes) => {
    const messageModel = sequelize.define('Message', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        parentId: DataTypes.BIGINT,
        messageType: DataTypes.STRING,
        recipient: DataTypes.STRING,
        subject: DataTypes.STRING,
        body: DataTypes.STRING,
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
    }, {
        tableName: 'messages',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                messageModel.belongsTo(models.Lead, {
                    foreignKey: 'parentId',
                    onDelete: 'CASCADE',
                });
            },
        },
        hooks: {
            beforeCreate: message => new Promise((resolve, reject) => {
                getNextIdNumber(messageModel)
                    .then((nextId) => {
                        message.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
            beforeBulkCreate: messages => new Promise((resolve, reject) => {
                getNextIdNumber(messageModel)
                    .then((nextId) => {
                        let messageId = nextId;
                        messages.forEach((message) => {
                            message.id = messageId;
                            messageId += 1;
                        });
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
            afterCreate: message => new Promise((resolve, reject) => {
                const { recipient, body } = message;
                const messageToSend = {
                    body,
                    to: recipient,
                };
                sendTextMessages([messageToSend])
                    .then(() => getTransformedModifiers(message)
                        .then(results => resolve(results))
                        .catch(() => resolve(message)))
                    .catch(error => reject(error));
            }),
            afterBulkCreate: messages => new Promise((resolve, reject) => {
                const messagesToSend = messages.map(message => ({
                    body: message.body,
                    to: message.recipient,
                }));
                sendTextMessages(messagesToSend)
                    .then(() => getTransformedModifiers(messages)
                        .then(results => resolve(results))
                        .catch(() => resolve(messages)))
                    .catch(error => reject(error));
            }),
            afterFind: result => getTransformedModifiers(result),
        },
        scopes: {
            inParent: parentId => ({ where: { parentId } }),
        },
    });
    return messageModel;
};

export default defineMessage;