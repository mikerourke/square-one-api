/* Internal dependencies */
import sendMessage from '../index';

describe('Text Messaging', () => {
    it('send text message to valid recipient', (done) => {
        const to = process.env.MY_PHONE_NUMBER;
        const body = 'This is a test message.';
        sendMessage(to, body)
            .should.be.fulfilled
            .notify(done);
    })
});