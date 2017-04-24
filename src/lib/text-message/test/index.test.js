/* Internal dependencies */
import sendTextMessages from '../index';

describe('Text Messaging', () => {
    const singleMessage = {
        to: process.env.MY_PHONE_NUMBER,
        body: 'This is a test message.'
    };

    it.skip('sends single text message to valid recipient', (done) => {
        sendTextMessages([singleMessage])
            .should.be.fulfilled
            .notify(done);
    });

    it.skip('sends multiple text messages to valid recipients', (done) => {
        const secondMessage = Object.assign({}, singleMessage, {
            body: 'This is a second message.'
        });
        const messagesToSend = [singleMessage, secondMessage];
        sendTextMessages(messagesToSend)
            .should.be.fulfilled
            .notify(done);
    });

    it('fails to send message to invalid recipient', (done) => {
        const errorMsg = 'The \'To\' number 123 is not a valid phone number.';
        const invalidMessage = Object.assign(singleMessage, { to: '123' });
        sendTextMessages([invalidMessage])
            .should.be.rejectedWith(errorMsg)
            .notify(done);
    });
});