/**
 * Assigns routes for Lead entities to the application router.
 */
import models from '../models';

const notFoundMessage = { message: 'Lead not found' };

const appointmentInclusion = {
    include: [{
        model: models.Appointment,
        as: 'appointments',
    }],
};

const populatedLead = (requestBody) => {
    const leadWithContents = {};
    Object.keys(requestBody).forEach((key) => {
        leadWithContents[key] = requestBody[key];
    });
    console.log(leadWithContents);
    return leadWithContents;
};

export default (router) => {
    router
        .route('/leads/')
        .get((req, res) => {
            return models.Lead
                .findAll(appointmentInclusion)
                .then(leads => res.status(200).send(leads))
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return models.Lead
                .create(populatedLead(req.body))
                .then(lead => res.status(201).send(lead))
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/leads/:leadId')
        .get((req, res) => {
            return models.Lead
                .findById(req.params.leadId, appointmentInclusion)
                .then((lead) => {
                    if (!lead) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(lead);
                })
                .catch(error => res.status(400).send(error));
        })
        .put((req, res) => {
            return models.Lead
                .findById(req.params.leadId, appointmentInclusion)
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
                .findById(req.params.leadId)
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
