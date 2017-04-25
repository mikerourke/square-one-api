/* @flow */

/* Internal dependencies */
import models from '../models';
import {
    getFieldsForCreate,
    getTransformedModifiers,
} from '../lib/entity-modifications';

/* Types */
import type { Router } from 'express';

const { Change } = (models: Object);
const notFoundMessage = { message: 'Change not found' };

/**
 * Assigns routes to the Express Router instance associated with Change models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignChangeRoutes = (router: Router) => {
    router
        .route('/leads/:leadId/changes')
        .get((req, res) => {
            return Change.scope({ method: ['inParent', req.params.leadId] })
                .findAll()
                .then(getTransformedModifiers)
                .then((changes) => {
                    if (!changes) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(changes);
                })
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return Change
                .create(Object.assign({}, req.body, {
                    parentId: req.params.leadId,
                }), { 
                    fields: getFieldsForCreate(req.body).concat('parentId'),
                })
                .then(getTransformedModifiers)
                .then(change => res.status(201).send(change))
                .catch(error => res.status(400).send(error));
        });
};

export default assignChangeRoutes;