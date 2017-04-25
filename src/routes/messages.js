/* @flow */

/* Internal dependencies */
import models from '../models';
import { getBulkTransformedModifiers } from '../lib/transform-data';

/* Types */
import type { Router } from 'express';

const { Message } = (models: Object);
const notFoundMessage = { message: 'Message not found' };

const whereInParent = (parentId: string) => ({
    where: { parentId },
});

/**
 * Assigns routes to the Express Router instance associated with Message models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignMessageRoutes = (router: Router) => {
    router
        .route('/leads/:leadId/messages')
        .get((req, res) => {
            return Message
                .findAll(whereInParent(req.params.leadId))
                .then(getBulkTransformedModifiers)
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
                }))
                .then(message => res.status(201).send(message))
                .catch(error => res.status(400).send(error));
        });
};

export default assignMessageRoutes;