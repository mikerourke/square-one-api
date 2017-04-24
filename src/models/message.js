/* @flow */

/* Internal dependencies */
import getNextIdNumber from '../lib/id-generator';
import sendTextMessages from '../lib/text-message';

const messageModel = (sequelize: Sequelize, DataTypes: DataTypes) => {
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
        createdBy: DataTypes.INTEGER,
        updatedBy: DataTypes.INTEGER,
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
            /**
             * Send text message to the user using the Twilio API after the
             *      database record is created.
             */
            afterCreate: message => new Promise((resolve, reject) => {
                const { recipient, body } = message;
                const messageToSend = {
                    body,
                    to: recipient,
                };
                sendTextMessages([messageToSend])
                    .then(() => resolve())
                    .catch(error => reject(error));
            }),
        },
    });
    return Message;
};

export default messageModel;