/* @flow */

/* External dependencies */
import twilio from 'twilio';

/* Types */
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

// If the Twilio environment variables aren't present, no messages will be sent.
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const sendingNumber = process.env.TWILIO_NUMBER || '';

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
    client.messages.create(messageToSend)
      .then(() => resolve())
      .catch(error => reject(new Error(error)));
  });

/**
 * Checks for the presence of required environment variables and returns an
 *    error message is any of them weren't found.
 * @returns {string} Error message to display.
 */
const validateEnvVars = (): string => {
  if (accountSid === '') {
    return 'Twilio account SID could not be found.';
  }
  if (authToken === '') {
    return 'Twilio authorization token could not be found.';
  }
  if (sendingNumber === '') {
    return 'Twilio sending number could not be found.';
  }
  return '';
};

/**
 * Loops through specified text messages and sends each one out using the
 *    Twilio API.
 * @param {Array} textMessages Text messages to send.
 */
const sendTextMessages = (textMessages: Array<TextMessage>): Promise<*> =>
  new Promise((resolve, reject) => {
    // Ensure Twilio environment variables are present.
    const envVarMessage = validateEnvVars();
    if (!envVarMessage === '') {
      reject(new Error(envVarMessage));
    }

    const messagesSent = textMessages.map(textMessage =>
      sendTextMessage(textMessage));
    Promise.all(messagesSent)
      .then(() => resolve())
      .catch(error => reject(new Error(error)));
  });

export default sendTextMessages;
