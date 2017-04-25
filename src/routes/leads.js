/* @flow */

/* Internal dependencies */
import models from '../models';
import {
    getFieldsForCreate,
    getFieldsForUpdate,
    getTransformedModifiers,
} from '../lib/entity-modifications';

/* Types */
import type { Router } from 'express';

const { Change, Message, Lead, Note } = (models: Object);
const notFoundMessage = { message: 'Lead not found' };

const childrenInclusion = {
    include: [
        {
            model: Change,
            as: 'changes',
        },
        {
            model: Message,
            as: 'messages',
        },
        {
            model: Note,
            as: 'notes',
        },
    ],
};

const assignLeadRoutes = (router: Router) => {
    router
        .route('/leads')
        .get((req, res) => {
            return Lead
                .findAll(childrenInclusion)
                .then(getTransformedModifiers)
                .then(leads => res.status(200).send(leads))
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return Lead
                .create(req.body, {
                    fields: getFieldsForCreate(req.body),
                })
                .then(getTransformedModifiers)
                .then(lead => res.status(201).send(lead))
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/leads/:leadId')
        .get((req, res) => {
            return Lead
                .findById(req.params.leadId, childrenInclusion)
                .then(getTransformedModifiers)
                .then((lead) => {
                    if (!lead) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(lead);
                })
                .catch(error => res.status(400).send(error));
        })
        .patch((req, res) => {
            return Lead
                .findById(req.params.leadId, childrenInclusion)
                .then((lead) => {
                    if (!lead) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return lead
                        .update(req.body, {
                            fields: getFieldsForUpdate(req.body),
                        })
                        .then(() => getTransformedModifiers(lead))
                        .then(updatedLead => res.status(200).send(updatedLead))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        })
        .delete((req, res) => {
            return Lead
                .findById(req.params.leadId, childrenInclusion)
                .then(getTransformedModifiers)
                .then((lead) => {
                    if (!lead) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return lead
                        .destroy()
                        .then(() => res.status(204).send())
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });
};

export default assignLeadRoutes;
