/* @flow */

/* External dependencies */
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import LocalStrategy from 'passport-local';

/* Internal dependencies */
import models from '../../models';

const secret = process.env.JWT_SECRET || 'SECRET KEY';

const { User } = (models: Object);

/**
 * Setup the local strategy for Passport authentication.
 */
const localLogin = new LocalStrategy({ usernameField: 'username' },
  (username, password, done) => {
    User.findOne({ where: { username } })
      .then((user) => {
        user.authenticate(password)
          .then(authenticatedUser => done(null, authenticatedUser))
          .catch(error => done(error));
      })
      .catch(error => done(null, false, { error }));
  });

/**
 * Setup the JWT strategy for Passport authentication.
 */
const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: secret,
  },
  (payload, done) => {
    User.findOne({ where: { username: payload.username } })
      .then(user => done(null, user))
      .catch(error => done(null, false, { error }));
  });

passport.use(jwtLogin);
passport.use(localLogin);
