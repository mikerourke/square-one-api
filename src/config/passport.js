/* @flow */

// TODO: Finish authentication.
// http://blog.slatepeak.com/refactoring-a-basic-authenticated-api-with-node-express-and-mongo/

/* External dependencies */
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { sign } from 'jsonwebtoken';
import passport from 'passport';
import LocalStrategy from 'passport-local';

/* Internal dependencies */
import models from '../models';

const { secret } = require('../config/config.json');

const { User } = (models: Object);
const localOptions = { usernameField: 'username' };

const localLogin = new LocalStrategy(localOptions,
    (username, password, done) => {
        User.findOne({ where: { username } })
            .then((user) => {
                user.authenticate(password)
                    .then(authenticatedUser => done(null, authenticatedUser))
                    .catch(error => done(error));
            })
            .catch(error => done(null, false, { error }));
    });

const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: secret,
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id)
        .then((user) => {
            done(null, user);
        })
        .catch(error => done(error, false));
});

passport.use(jwtLogin);
passport.use(localLogin);

const generateToken = (user: Object) => sign(user, secret, {
    expiresIn: 10080,
});