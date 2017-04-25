/* @flow */

/* Internal dependencies */
import models from '../models';
import {
    getFieldsForCreate,
    getTransformedModifiers,
} from '../lib/entity-modifications';

/* Types */
import type { Router } from 'express';

const { Message } = (models: Object);
const notFoundMessage = { message: 'Message not found' };

/**
 * Assigns routes to the Express Router instance associated with Message models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignMessageRoutes = (router: Router) => {
    router
        .route('/leads/:leadId/messages')
        .get((req, res) => {
            return Message.scope({ method: ['inParent', req.params.leadId] })
                .findAll()
                .then(getTransformedModifiers)
                .then((messages) => {
                    if (!messages) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(messages);
                })
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return Message
                .create(Object.assign({}, req.body, {
                    parentId: req.params.leadId,
                }), {
                    fields: getFieldsForCreate(req.body).concat('parentId'),
                })
                .then(getTransformedModifiers)
                .then(message => res.status(201).send(message))
                .catch(error => res.status(400).send(error));
        });
};

export default assignMessageRoutes;