/* @flow */

/* Internal dependencies */
import models from '../models';
import { transformModifiers } from '../lib/transform-data';

/* Types */
import type { Router } from 'express';

// TODO: Add comments to Lead routes helper methods.

type LeadWithChildren = {
    changes: Array<Object>,
    messages: Array<Object>,
    notes: Array<Object>,
    createdBy: number | Object,
    updatedBy: number | Object,
};

const { Change, Message, Lead, Note, User } = (models: Object);
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

const transformLeadAndChildModifiers = (users, lead): LeadWithChildren => {
    const { changes, messages, notes } = lead;
    lead.changes = changes.map(
        change => transformModifiers(users, change));
    lead.messages = messages.map(
        message => transformModifiers(users, message));
    lead.notes = notes.map(
        note => transformModifiers(users, note));
    return transformModifiers(users, lead);
};

const transformModifiersForMultipleLeads = leads =>
    new Promise((resolve, reject) => {
        User.findAll()
            .then((users) => {
                const updatedLeads = leads.map(lead =>
                    transformLeadAndChildModifiers(users, lead));
                resolve(updatedLeads);
            })
            .catch(error => reject(error));
    });

const transformModifiersForSingleLead = lead =>
    new Promise((resolve, reject) => {
        User.findAll()
            .then((users) => {
                const updatedLead = transformLeadAndChildModifiers(users, lead);
                resolve(updatedLead);
            })
            .catch(error => reject(error));
    });

const assignLeadRoutes = (router: Router) => {
    router
        .route('/leads/')
        .get((req, res) => {
            return Lead
                .findAll(childrenInclusion)
                .then(transformModifiersForMultipleLeads)
                .then(leads => res.status(200).send(leads))
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return Lead
                .create(req.body)
                .then(lead => res.status(201).send(lead))
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/leads/:leadId')
        .get((req, res) => {
            return Lead
                .findById(req.params.leadId, childrenInclusion)
                .then(transformModifiersForSingleLead)
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
                .then(transformModifiersForSingleLead)
                .then((lead) => {
                    if (!lead) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return lead
                        .update(req.body, { fields: Object.keys(req.body) })
                        .then(() => res.status(200).send(lead))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        })
        .delete((req, res) => {
            return Lead
                .findById(req.params.leadId, childrenInclusion)
                .then(transformModifiersForSingleLead)
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
