/* External dependencies */
import request from 'supertest';

/* Internal dependencies */
import { validUser } from '../../models/test/helpers';

export const URI = '127.0.0.1';

export const getTokenForTesting = app => new Promise((resolve, reject) => {
    request(app)
        .post('/api/auth/login')
        .set('X-Real-IP', URI)
        .type('form')
        .send(validUser)
        .end((error, res) => {
            if (error) reject(new Error(error));
            resolve(res.body.token);
        });
});