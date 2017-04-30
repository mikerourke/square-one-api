/* @flow */

/* External dependencies */
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import LocalStrategy from 'passport-local';

/* Internal dependencies */
import models from '../../models';

const secret = process.env.AUTH_SECRET || 'SECRET KEY';

const { User } = (models: Object);
const localOptions = { usernameField: 'username' };

/**
 * Setup the local strategy for Passport authentication.
 */
const localLogin = new LocalStrategy(localOptions,
    (username, password, done) => {
        User.findOne({ where: { username } })
            .then((user) => {
                user.authenticate(password)
                    .then(authenticatedUser => done(null, authenticatedUser))
                    .catch(err => done(err));
            })
            .catch(err => done(null, false, { err }));
    });

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: secret,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.id)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err, false));
});

passport.use(jwtLogin);
passport.use(localLogin);
