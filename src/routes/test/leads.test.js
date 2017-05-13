/* External dependencies */
import request from 'supertest';

/* Internal dependencies */
import app from '../../index';
import db from '../../models';
import { validLead, getIdForToday } from '../../models/test/helpers';
import { getTokenForTesting, URI } from './helpers';

const { Lead } = db;

describe('Lead Routes', () => {
  let token;

  const leadId = getIdForToday();

  const newLead = Object.assign({}, validLead, {
    leadName: 'Sally Tester',
  });

  before((done) => {
    db.sequelize.sync().then(() => {
      getTokenForTesting(app).then((jwtToken) => {
        token = jwtToken;

        Lead.findOrCreate({
          where: { id: leadId },
          defaults: validLead
        })
          .spread((newLead, created) => done())
          .catch(error => done());
      }).catch(error => done(error));
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
      .end((error, res) => {
        if (error) done(error);

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
      .delete(`/api/leads/${leadId}`)
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
      .end((error, res) => {
        if (error) done(error);

        const expectedResult = 'Sally Tester';
        const actualResult = res.body.leadName;
        expect(actualResult).to.equal(expectedResult);
        done();
      });
  });
});