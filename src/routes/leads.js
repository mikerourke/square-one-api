/**
 * Assigns routes for Lead entities to the application router.
 */
import models from '../models';

const notFoundMessage = { message: 'Lead not found' };

const childrenInclusion = {
    include: [
        {
            model: models.Change,
            as: 'changes',
        },
        {
            model: models.Message,
            as: 'messages',
        },
        {
            model: models.Note,
            as: 'notes',
        },
    ],
};

const getUpdatedEntity = (users, entity) => {
    const creator = users.find(user => +user.id === +entity.createdBy);
    const updater = users.find(user => +user.id === +entity.updatedBy);
    if (creator) {
        entity.createdBy = {
            id: creator.id,
            fullName: creator.fullName,
        };
    }
    if (updater) {
        entity.updatedBy = {
            id: updater.id,
            fullName: updater.fullName,
        };
    }
    return entity;
};

const updateUsersInInclusions = leads => new Promise((resolve, reject) => {
    models.User.findAll().then((users) => {
        leads.forEach((lead) => {
            const { changes } = lead;
            lead.changes = changes.map(
                change => getUpdatedEntity(users, change));
        });
        resolve(leads);
    });
});

const assignLeadRoutes = (router) => {
    router
        .route('/leads/')
        .get((req, res) => {
            return models.Lead
                .findAll(childrenInclusion)
                .then(updateUsersInInclusions)
                .then(leads => res.status(200).send(leads))
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return models.Lead
                .create(req.body)
                .then(lead => res.status(201).send(lead))
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/leads/:leadId')
        .get((req, res) => {
            return models.Lead
                .findById(req.params.leadId, childrenInclusion)
                .then((lead) => {
                    if (!lead) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(lead);
                })
                .catch(error => res.status(400).send(error));
        })
        .patch((req, res) => {
            return models.Lead
                .findById(req.params.leadId, childrenInclusion)
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
            return models.Lead
                .findById(req.params.leadId, childrenInclusion)
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
