/* @flow */

/* External dependencies */
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;

export type TextMessage = {
    to: string,
    body: string,
};

/*
 *  Error format for invalid phone number:
 *  {
 *     status: 400,
 *     message: 'The \'To\' number 123 is not a valid phone number.',
 *     code: 21211
 *     moreInfo: 'https://www.twilio.com/docs/errors/21211'
 *  }
 */

/**
 * Sends a message to the specified phone number using the Twilio client.
 * @param {TextMessage} textMessage Details of text message to send.
 */
const sendTextMessage = (textMessage: TextMessage): Promise<*> =>
    new Promise((resolve, reject) => {
        const client = twilio(accountSid, authToken);
        const { to, body } = textMessage;
        const messageToSend = {
            to,
            body,
            from: sendingNumber,
        };
        setTimeout(() => {
            client.messages.create(messageToSend, (error, data) => {
                if (error) {
                    reject(error.message);
                }
                resolve();
            });
        }, 5000);
    });

const sendTextMessages = (textMessages: Array<TextMessage>): Promise<*> =>
    new Promise((resolve, reject) => {
        const messagesSent = textMessages.map(
            textMessage => sendTextMessage(textMessage));
        Promise.all(messagesSent)
            .then(() => resolve())
            .catch(error => reject(error));
    });

export default sendTextMessages;