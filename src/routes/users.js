/* @flow */

/* Internal dependencies */
import models from '../models';

/* Types */
import type { Router, Request, Response } from 'express';

const { User } = (models: Object);
const notFoundMessage = { message: 'User not found' };

/**
 * Creates an object representing the where conditions to find the corresponding
 *      user using a Sequelize query.
 * @param {Object} entity Entity containing the data to build the condition.
 * @returns {Object} Condition object passed to Sequelize.
 */
const whereCondition = entity => ({ username: entity.username });

/**
 * Assigns routes to the Express Router instance associated with User models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignUserRoutes = (router: Router) => {
    router
        .route('/users/:username')
        .get((req: Request, res: Response) => {
            return User
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(user);
                })
                .catch(err => res.status(400).send(err));
        })
        .patch((req: Request, res: Response) => {
            return User
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return user
                        .update(req.body)
                        .then(() => res.status(200).send(user))
                        .catch(err => res.status(400).send(err));
                })
                .catch(err => res.status(400).send(err));
        });
};

export default assignUserRoutes;
