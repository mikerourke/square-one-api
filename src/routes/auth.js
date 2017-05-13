/* @flow */

/* External dependencies */
import { sign } from 'jsonwebtoken';
import passport from 'passport';

/* Internal dependencies */
import models from '../models';

/* Types */
import type { Router, Request, Response } from 'express';

type AuthUser = {
  id: number,
  username: string,
  fullName: string,
  phone: string,
  email: string,
  title: string,
  role: string,
};

const { User } = (models: Object);
const secret = process.env.JWT_SECRET;

/**
 * Returns a JSON Web Token for the specified user.
 * @param {AuthUser} user
 */
const generateToken = (user: AuthUser) => sign(user, secret, {
  expiresIn: 10080,
});

/**
 * Returns an object with user details for sending in the login route.
 * @param {Object} userObject Sequelize User instance to pull data from.
 */
const getUserForResponse = (userObject: Object): AuthUser => ({
  id: userObject.id,
  username: userObject.username,
  fullName: userObject.fullName,
  phone: userObject.phone,
  email: userObject.email,
  title: userObject.title,
  role: userObject.role,
});

const requireLogin = passport.authenticate('local', { session: false });

/**
 * Assigns routes to the Express Router instance associated with User models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignAuthRoutes = (router: Router) => {
  router
    .post('/login', requireLogin, (req: Request, res: Response) => {
      User.findOne({ where: { username: req.body.username } })
        .then((user) => {
          const userForResponse = getUserForResponse(user.toJSON());
          const jwtToken = generateToken(userForResponse);
          const jwtResponse = {
            user: userForResponse,
            token: `JWT ${jwtToken}`,
          };
          res.status(200).send(jwtResponse);
        })
        .catch(error => res.status(404).send(error));
    })
    .post('/logout', (req: Request, res: Response) => {
      User.findOne({ where: { username: req.body.username } })
        .then((user) => {
          const userForResponse = getUserForResponse(user.toJSON());
          res.status(200).send(userForResponse);
        })
        .catch(error => res.status(404).send(error));
    });
};

export default assignAuthRoutes;
