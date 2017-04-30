/* External dependencies */
import request from 'supertest';

export const validUser = {
    id: 1,
    username: 'mike',
    password: 'thisisthepassword',
    fullName: 'Mike Tester',
    email: 'mike@stuff.com',
};

export const URI = '127.0.0.1';

export const getTokenForTesting = (app) => new Promise((resolve, reject) => {
    request(app)
        .post('/api/auth/login')
        .set('X-Real-IP', URI)
        .type('form')
        .send(validUser)
        .end((err, res) => {
            if (err) reject(err);
            resolve(res.body.token);
        });
});