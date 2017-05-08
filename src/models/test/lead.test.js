/* Internal dependencies */
import db from '../index';
import { validLead } from './helpers';

describe.only('Lead Model', () => {
    before((done) => {
        db.sequelize.sync().then(() => done()).catch(error => done(error));
    });

    it('creates a new empty lead', (done) => {
        const emptyLead = {
            leadName: '',
            contactName: '',
            source: '',
            leadFee: 0,
            phone: null,
            email: null,
            address: '',
            lat: 0,
            lng: 0,
            description: '',
            status: 'New',
            assignTo: '',
            createdBy: 1,
            updatedBy: 1
        };
        db.Lead.create(emptyLead)
            .then((lead) => {
                expect(lead.id).to.be.greaterThan(0);
                done();
            })
            .catch(error => done(error));
    });

    it('creates a new populated lead', (done) => {
        db.Lead.create(validLead)
            .then((lead) => {
                expect(lead.leadName).to.equal('John Test');
                done();
            })
            .catch(error => done(error));
    });
});