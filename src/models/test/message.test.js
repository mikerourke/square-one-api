/* Internal dependencies */
import db from '../index';

describe('Message Model', () => {
    const messageInstance = {
        messageType: 'text',
        recipient: process.env.MY_PHONE_NUMBER,
        subject: 'Subject for Test',
        body: 'This is a message for testing.',
        createdBy: 1,
        createdAt: '2017-04-20 20:00:00',
        updatedBy: 1,
        updatedAt: '2017-04-20 20:00:00'
    };

    const createNewMessage = (messageToCreate) =>
        new Promise((resolve, reject) => {
            db.Message
                .create(messageToCreate)
                .then((message) => resolve(message))
                .catch(err => reject(err));
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