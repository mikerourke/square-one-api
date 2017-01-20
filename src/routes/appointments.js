import { Router } from 'express';
import models from '../models';

const notFoundMessage = { message: 'Lead not found' };

const populatedAppointment = (request) => {
    const requestBody = request.body;
    let appointmentWithContents = {};
    Object.keys(requestBody).forEach(key => {
        if (!key.toString().includes('leadId')) {
            appointmentWithContents[key] = requestBody[key];
        }
    });
    appointmentWithContents.leadId = request.params.leadId;
    return appointmentWithContents;
};

export default (router) => {
    router
        .route('/leads/:leadId/appointments')
        .get((req, res) => {
            return models.Appointment
                .all()
                .then(appointments => res.status(200).send(appointments))
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return models.Appointment
                .create(populatedAppointment(req))
                .then(lead => res.status(201).send(lead))
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/leads/:leadId/appointments/:appointmentId')
        .get((req, res) => {
            return models.Appointment
                .findById(req.params.appointmentId)
                .then(appointment => {
                    if (!appointment) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(appointment);
                })
                .catch(error => res.status(400).send(error));
        })
        .put((req, res) => {
            return models.Appointment
                .findById(req.params.appointmentId)
                .then(appointment => {
                    if (!appointment) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return appointment
                        .update(req.body, { fields: Object.keys(req.body) })
                        .then(() => res.status(200).send(appointment))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        })
        .delete((req, res) => {
            return models.Appointment
                .findById(req.params.appointmentId)
                .then(appointment => {
                    if (!appointment) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return appointment
                        .destroy()
                        .then(() => res.status(204).send())
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });
};