/* Internal dependencies */
import db from '../index';

describe.skip('Message Model', () => {
    const messageInstance = {
        messageType: 'text',
        recipient: process.env.MY_PHONE_NUMBER,
        subject: 'Subject for Test',
        body: 'This is a message for testing.',
        createdBy: 4,
        createdAt: '2017-04-20 20:00:00',
        updatedBy: 4,
        updatedAt: '2017-04-20 20:00:00'
    };

    const createNewMessage = (messageToCreate) =>
        new Promise((resolve, reject) => {
            db.Message
                .create(messageToCreate)
                .then((message) => resolve(message))
                .catch(error => reject(error));
        });

    before((done) => {
        db.sequelize.sync().then(() => done());
    });

    it('creates a new message', (done) => {
        createNewMessage(messageInstance)
            .then((message) => {
                expect(message.messageType).to.equal('text');
                done();
            })
            .catch(done);
    });
});