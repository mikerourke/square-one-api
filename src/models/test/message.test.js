/* Internal dependencies */
import db from '../index';
import { validMessage, validLead } from './helpers';

describe('Message Model', () => {
    let leadFromDb;

    before((done) => {
        db.sequelize.sync()
            .then(() => {
                db.Lead.create(validLead)
                    .then((lead) => {
                        leadFromDb = lead;
                        done();
                    })
                    .catch(error => done(error));
            })
            .catch(error => done(error));
    });

    it('creates new messages', (done) => {
        const messageToCreate = { ...validMessage, parentId: leadFromDb.id };
        const messagesToCreate = [messageToCreate];
        db.Message.bulkCreate(messagesToCreate)
            .then((messages) => {
                expect(messages[0].messageType).to.equal('text');
                done();
            })
            .catch(done);
    });
});