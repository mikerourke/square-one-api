/* External dependencies */
import request from 'supertest';

/* Internal dependencies */
import app from '../../index';
import db from '../../models';
import { validUser, URI } from './.test.js';

describe('Authentication Routes', () => {
    before((done) => {
        db.sequelize.sync().then(() => done());
    });

    it('fails [400] to login without parameters', (done) => {
        request(app)
            .post('/api/auth/login')
            .set('X-Real-IP', URI)
            .expect(400, done)
    });

    it('fails [400] to login with bad parameters', (done) => {
        request(app)
            .post('/api/auth/login')
            .set('X-Real-IP', URI)
            .type('form')
            .send({ wrongparam: 'error' })
            .expect(400, done);
  });

    it('fails [401] to login with invalid credentials', (done) => {
        request(app)
            .post('/api/auth/login')
            .set('X-Real-IP', URI)
            .type('form')
            .send({ username: 'error', password: '22' })
            .expect(401, done);
    });

    it('login [200] with valid credential', (done) => {
        request(app)
            .post('/api/auth/login')
            .set('X-Real-IP', URI)
            .type('form')
            .send(validUser)
            .expect(200)
            .end((error, res) => {
                if (error) done(error);
                
                const { token, user } = res.body;
                assert.isString(token, 'Token is a string');
                assert.isObject(user, 'User is an object.');
                done();
            });
    });
});