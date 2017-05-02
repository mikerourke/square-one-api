/* @flow */

/* Internal dependencies */
import { getTransformedModifiers } from '../lib/entity-modifications';
import getNextIdNumber from '../lib/id-generator';
import sendTextMessages from '../lib/text-message';

const assignIdsHook = (
    messageModel: Object,
    messages: Array<Object>,
): Promise<*> =>
    new Promise((resolve, reject) => {
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
    });

const sendMessagesHook = (messages: Array<Object>): Promise<*> =>
    new Promise((resolve, reject) => {
        const messagesToSend = messages.map(message => ({
            body: message.body,
            to: message.recipient,
        }));
        sendTextMessages(messagesToSend)
            .then(() => resolve())
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
                            .catch(error => reject(error));
                    })
                    .catch(error => reject(error));
            }),
            afterBulkCreate: messages => getTransformedModifiers(messages),
            afterFind: result => getTransformedModifiers(result),
        },
        scopes: {
            inParent: parentId => ({ where: { parentId } }),
        },
    });
    return messageModel;
};

export default defineMessage;
