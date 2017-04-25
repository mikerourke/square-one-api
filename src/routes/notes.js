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

const { Note } = (models: Object);
const notFoundMessage = { message: 'Note not found' };

/**
 * Assigns routes to the Express Router instance associated with Note models.
 * @param {Object} router Express router that routes are assigned to.
 */
const assignNoteRoutes = (router: Router) => {
    router
        .route('/leads/:leadId/notes')
        .get((req, res) => {
            return Note.scope({ method: ['inParent', req.params.leadId] })
                .findAll()
                .then(getTransformedModifiers)
                .then((notes) => {
                    if (!notes) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(notes);
                })
                .catch(error => res.status(400).send(error));
        })
        .post((req, res) => {
            return Note
                .create(Object.assign({}, req.body, {
                    parentId: req.params.leadId,
                }), { 
                    fields: getFieldsForCreate(req.body).concat('parentId'),
                })
                .then(getTransformedModifiers)
                .then(note => res.status(201).send(note))
                .catch(error => res.status(400).send(error));
        });

    router
        .route('/leads/:leadId/notes/:noteId')
        .get((req, res) => {
            return Note
                .findById(req.params.noteId)
                .then(getTransformedModifiers)
                .then((note) => {
                    if (!note) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return res.status(200).send(note);
                })
                .catch(error => res.status(400).send(error));
        })
        .patch((req, res) => {
            return Note
                .findById(req.params.noteId)
                .then((note) => {
                    if (!note) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return note
                        .update(req.body, {
                            fields: getFieldsForUpdate(req.body),
                        })
                        .then(() => getTransformedModifiers(note))
                        .then(updatedNote => res.status(200).send(updatedNote))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        })
        .delete((req, res) => {
            return Note
                .findById(req.params.noteId)
                .then(getTransformedModifiers)
                .then((note) => {
                    if (!note) {
                        return res.status(404).send(notFoundMessage);
                    }
                    return note
                        .destroy()
                        .then(() => res.status(204).send(note))
                        .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
        });
};

export default assignNoteRoutes;
