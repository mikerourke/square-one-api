/* @flow */

/* Internal dependencies */
import models from '../models';

/* Types */
import type { Router, Request, Response } from 'express';

const { Setting } = (models: Object);
const notFoundMessage = { message: 'Setting not found' };

/**
 * Creates an object representing the where conditions to find the corresponding
 *      setting using a Sequelize query.
 * @param {Object} entity Entity containing the data to build the condition.
 * @returns {Object} Condition object passed to Sequelize.
 */
const whereCondition = (entity) => {
    return {
        category: entity.category,
        groupName: entity.groupName,
    };
};

/**
 * Assigns routes to the Express Router instance associated with Setting models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignSettingRoutes = (router: Router) => {
    router
        .route('/settings/')
        .get((req: Request, res: Response) => {
            return Setting
                .findAll()
                .then((settings) => {
                    if (!settings) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(settings);
                })
                .catch(error => res.status(400).send(error));
        })
        .post((req: Request, res: Response) => {
            return Setting
                .upsert(req.body)
                .then((wasCreated) => {
                    const { body = {} } = req;
                    const settingToSend = Object.assign({}, body, {
                        action: wasCreated ? 'created' : 'updated',
                    });
                    res.status(201).send(settingToSend);
                })
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/settings/:category/:groupName')
        .get((req: Request, res: Response) => {
            return Setting
                .findOne({
                    attributes: ['data'],
                    where: whereCondition(req.params),
                })
                .then((setting) => {
                    if (!setting) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(setting.data);
                })
                .catch(error => res.status(400).send(error));
        })
        .patch((req: Request, res: Response) => {
            return Setting
                .findOne({
                    where: whereCondition(req.params),
                })
                .then((setting) => {
                    if (!setting) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return setting
                        .update(req.body)
                        .then(() => res.status(200).send(setting))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });
};

export default assignSettingRoutes;