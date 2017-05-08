/* @flow */

/* Internal dependencies */
import models from '../models';
import { getFieldsForCreate } from '../lib/entity-modifications';

/* Types */
import type { Router, Request, Response } from 'express';

const { Message } = (models: Object);
const notFoundMessage = { message: 'Message not found' };

/**
 * Assigns routes to the Express Router instance associated with Message models.
 * @param {Object} router Express router that routes are assigned to.
 */
export default function assignMessageRoutes(router: Router) {
    router
        .route('/leads/:leadId/messages')
        .get((req: Request, res: Response) => {
            return Message.scope({ method: ['inParent', req.params.leadId] })
                .findAll()
                .then((messages) => {
                    if (!messages) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(messages);
                })
                .catch(error => res.status(400).send(error));
        })
        .post((req: Request, res: Response) => {
            const { body = {}, params: { leadId = 0 } } = req;
            const newEntities = body.map(message => Object.assign({}, message, {
                parentId: leadId,
            }));
            const fields = getFieldsForCreate(newEntities[0]);
            return Message
                .bulkCreate(newEntities, { fields })
                .then(messages => res.status(201).send(messages))
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/leads/:leadId/messages/:messageId')
        .get((req: Request, res: Response) => {
            return Message
                .findOne({
                    where: {
                        parentId: req.params.leadId,
                        id: req.params.messageId,
                    },
                })
                .then((message) => {
                    if (!message) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(message);
                })
                .catch(error => res.status(400).send(error));
        });
}