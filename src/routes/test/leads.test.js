/* External dependencies */
import request from 'supertest';

/* Internal dependencies */
import app from '../../index';
import db from '../../models';
import { getTokenForTesting, validUser, URI } from './.test.js';

const { Lead } = db;

describe.only('Lead Routes', () => {
    let token;

    const leadId = 1011701010001;
    const validLead = {
        id: leadId,
        leadName: 'John Test',
        contactName: '',
        source: 'Facebook',
        leadFee: 0,
        phone: '1234567890',
        email: 'john@test.com',
        address: '123 Fake Street',
        lat: 0,
        lng: 0,
        description: 'This is a test lead',
        status: 'Active',
        assignTo: '',
        createdBy: 1,
        updatedBy: 1
    };

    const newLead = Object.assign({}, validLead, {
        id: leadId + 1,
        leadName: 'Sally Tester',
    });

    before((done) => {
        db.sequelize.sync().then(() => {
            getTokenForTesting(app).then((jwtToken) => {
                token = jwtToken;

                Lead.findOrCreate({
                        where: { id: validLead.id },
                        defaults: validLead
                    })
                    .spread((newLead, created) => done())
                    .catch(err => done());
            }).catch(err => done(err));
        });
    });

    it('fails to get data if not authorized', (done) => {
        request(app)
            .get('/api/leads')
            .set('X-Real-IP', URI)
            .expect(401, done)
    });

    it('can get leads [200] if authorized', (done) => {
        request(app)
            .get('/api/leads')
            .set('X-Real-IP', URI)
            .set('Authorization', token)
            .expect(200, done)
    });

    it('gets lead by ID', (done) => {
        request(app)
            .get(`/api/leads/${leadId.toString()}`)
            .set('X-Real-IP', URI)
            .set('Authorization', token)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);

                const actualResult = res.body;
                const expectedResult = Object.keys(validLead).concat([
                    'changes',
                    'messages',
                    'notes',
                    'createdAt',
                    'updatedAt',
                ]);
                expect(actualResult).to.contain.all.keys(expectedResult);
                expect(actualResult.id).to.equal(leadId.toString());
                done();
            });
    });

    it('deletes a lead', (done) => {
        request(app)
            .delete(`/api/leads/${newLead.id}`)
            .set('X-Real-IP', URI)
            .set('Authorization', token)
            .expect(204, done);
    });

    it('creates a lead', (done) => {
        request(app)
            .post('/api/leads')
            .set('X-Real-IP', URI)
            .set('Authorization', token)
            .send(newLead)
            .end((err, res) => {
                if (err) done(err);

                const expectedResult = 'Sally Tester';
                const actualResult = res.body.leadName;
                expect(actualResult).to.equal(expectedResult);
                done();
            });
    });
});