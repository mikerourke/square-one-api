/* @flow */

/* Internal dependencies */
import models from '../models';
import { getFieldsForCreate } from '../lib/entity-modifications';

/* Types */
import type { Router, Request, Response } from 'express';

const { Change } = (models: Object);
const notFoundMessage = { message: 'Change not found' };

/**
 * Assigns routes to the Express Router instance associated with Change models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignChangeRoutes = (router: Router) => {
    router
        .route('/leads/:leadId/changes')
        .get((req: Request, res: Response) => {
            return Change.scope({ method: ['inParent', req.params.leadId] })
                .findAll()
                .then((changes) => {
                    if (!changes) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(changes);
                })
                .catch(err => res.status(400).send(err));
        })
        .post((req: Request, res: Response) => {
            const { body = {}, params: { leadId = 0 } } = req;
            const newEntity = Object.assign({}, body, {
                parentId: leadId,
            });
            return Change
                .create(newEntity, { fields: getFieldsForCreate(newEntity) })
                .then(change => res.status(201).send(change))
                .catch(err => res.status(400).send(err));
        });
};

export default assignChangeRoutes;