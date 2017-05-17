/* Internal dependencies */
import sendTextMessages from '../index';

describe.only('Text Messaging', () => {
  const singleMessage = {
    to: process.env.MY_PHONE_NUMBER,
    body: 'This is a test message.'
  };

  describe('Sending Text Messages', () => {
    it('sends single text message to valid recipient', (done) => {
      sendTextMessages([singleMessage])
        .should.be.fulfilled
        .notify(done);
    });

    it('sends multiple text messages to valid recipients', (done) => {
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

  // FIXME: These tests aren't working, I think it has something to do with the environment variables not being set.
  describe.only('Checking Environment Variables', () => {
    it('raises an error if TWILIO_ACCOUNT_SID environment variable is missing', (done) => {
      process.env['TWILIO_ACCOUNT_SID'] = '';
      sendTextMessages([singleMessage])
        .should.be.rejected
        .notify(done);
    });

    it('raises an error if TWILIO_AUTH_TOKEN environment variable is missing', (done) => {
      process.env['TWILIO_AUTH_TOKEN'] = '';
      sendTextMessages([singleMessage])
        .should.be.rejected
        .notify(done);
    });

    it('raises an error if TWILIO_NUMBER environment variable is missing', (done) => {
      process.env['TWILIO_NUMBER'] = '';
      sendTextMessages([singleMessage])
        .should.be.rejected
        .notify(done);
    });
  });
});
