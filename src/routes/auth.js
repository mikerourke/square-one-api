/* @flow */

/* External dependencies */
import { sign } from 'jsonwebtoken';
import passport from 'passport';
import crypto from 'crypto';

/* Internal dependencies */
import models from '../models';

/* Types */
import type { Router, Request, Response } from 'express';

type AuthUser = {
    id: number,
    fullName: string,
    email: string,
    role: string,
};

const { User } = (models: Object);
const secret = process.env.AUTH_SECRET;

/**
 * Returns a JSON Web Token for the specified user.
 * @param {AuthUser} user 
 */
const generateToken = (user: AuthUser) => sign(user, secret, {
    expiresIn: 10080,
});

/**
 * Returns an object with user details extrapolated from the request body.
 * @param {Request} req HTTP request associated with API call.
 */
const getUserFromRequest = (req: Request): AuthUser => {
    const user = {
        id: 0,
        fullName: '',
        email: '',
        role: '',
    };
    if (req.body) {
        return Object.assign({}, user, req.body);
    }
    return user;
};

/**
 * Ensures the user is an administrator prior to allowing access to the
 *      administration dashboard.
 * @param {string} role Role of the user.
 */
const authorizeRole = (role: string) =>
    (req: Request, res: Response, next) => {
        const { id } = getUserFromRequest(req);
        User.findById(id)
            .then((user) => {
                if (user.role === role) {
                    return next();
                }
                res.status(401).json({ 
                    err: 'You are not authorized to view this content.',
                });
                return next('Unauthorized');
            })
            .catch((err) => {
                res.status(422).json({ err: 'User not found.' });
                return next(err);
            });
    };

const requireLogin = passport.authenticate('local', { session: false });

/**
 * Assigns routes to the Express Router instance associated with User models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignAuthRoutes = (router: Router) => {
    router
        .post('/login', requireLogin, (req: Request, res: Response) => {
            const user = getUserFromRequest(req);
            const jwtToken = generateToken(user);
            const jwtResponse = {
                user,
                token: `JWT ${jwtToken}`,
            };
            res.status(200).status(200).json(jwtResponse);
        });
};

export default assignAuthRoutes;
