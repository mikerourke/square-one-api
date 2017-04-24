/* @flow */

/* Internal dependencies */
import getNextIdNumber from '../lib/id-generator';
import sendTextMessage from '../lib/text-message';

// TODO: Finish implementation for automatically sending text messages.
const sendMessageBeforeCreate = (message: Object): Promise<*> =>
    new Promise((resolve, reject) => {
        const { recipient, body } = message;
        sendTextMessage(recipient, body)
            .then(() => resolve())
            .catch(error => reject(error));
    });

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        parentId: DataTypes.BIGINT,
        messageType: DataTypes.STRING,
        recipient: DataTypes.STRING,
        subject: DataTypes.STRING,
        body: DataTypes.STRING,
        wasSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        tableName: 'messages',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                Message.belongsTo(models.Lead, {
                    foreignKey: 'parentId',
                    onDelete: 'CASCADE',
                });
            },
        },
        hooks: {
            beforeCreate: message => new Promise((resolve, reject) => {
                getNextIdNumber(Message)
                    .then((nextId) => {
                        message.id = nextId;
                        resolve();
                    })
                    .catch(error => reject(error));
            }),
            afterCreate: message => new Promise((resolve, reject) => {
                const { recipient, body } = message;
                sendTextMessage(recipient, body)
                    .then(() => resolve())
                    .catch(error => reject(error));
            }),
        },
    });
    return Message;
};