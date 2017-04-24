import db from '../index';

describe.skip('Message Model', () => {
    let message;
    const messageInstance = {
        messageType: 'text',
        recipient: process.env.MY_PHONE_NUMBER,
        subject: "Subject for Test",
        body: "This is a message for testing.",
        createdBy: 4,
        createdAt: "2002-08-15 20:14:07",
        updatedBy: 4,
        updatedAt: "1975-04-15 02:35:23"
    };

    before((done) => {
        db.sequelize.sync().then(() => {
            message = db.Message.build(messageInstance);
            done();
        })
    });

});