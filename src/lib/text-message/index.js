/* @flow */

/* External dependencies */
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;

/**
 * Sends a message to the specified phone number using the Twilio client.
 * @param {string} to Phone number to send the message to.
 * @param {string} message Message to send to the user.
 */
const sendMessage = (to: string, message: string): Promise<*> =>
    new Promise((resolve, reject) => {
        const client = twilio(accountSid, authToken);
        const messageToSend = {
            to,
            body: message,
            from: sendingNumber,
        };
        client.messages.create(messageToSend, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });

export default sendMessage;