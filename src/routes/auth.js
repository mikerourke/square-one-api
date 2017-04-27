/* @flow */

/* External dependencies */
import { sign } from 'jsonwebtoken';

const secret = process.env.AUTH_SECRET;

const generateToken = (user: Object) => sign(user, secret, {
    expiresIn: 10080,
});

const setUserInfo = (request: Object) => ({  
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role,
});