/* @flow */

/* Internal dependencies */
import models from '../models';
import {
  getFieldsForCreate,
  getFieldsForUpdate,
  getTransformedModifiers,
} from '../lib/entity-modifications';

/* Types */
import type { Router, Request, Response } from 'express';

const { Note } = (models: Object);
const notFoundMessage = { message: 'Note not found' };

/**
 * Assigns routes to the Express Router instance associated with Note models.
 * @param {Object} router Express router that routes are assigned to.
 */
export default function assignNoteRoutes(router: Router) {
  router
    .route('/leads/:leadId/notes')
    .get((req: Request, res: Response) => {
      return Note.scope({ method: ['inParent', req.params.leadId] })
        .findAll()
        .then((notes) => {
          if (!notes) {
            return res.status(404).send(notFoundMessage);
          }
          return res.status(200).send(notes);
        })
        .catch(error => res.status(400).send(error));
    })
    .post((req: Request, res: Response) => {
      const { body = {}, params: { leadId = 0 } } = (req: Object);
      const newEntity = Object.assign({}, body, {
        parentId: leadId,
      });
      return Note
        .create(newEntity, { fields: getFieldsForCreate(newEntity) })
        .then(note => res.status(201).send(note))
        .catch(error => res.status(400).send(error));
    });

  router
    .route('/leads/:leadId/notes/:noteId')
    .get((req: Request, res: Response) => {
      return Note
        .findById(req.params.noteId)
        .then((note) => {
          if (!note) {
            return res.status(404).send(notFoundMessage);
          }
          return res.status(200).send(note);
        })
        .catch(error => res.status(400).send(error));
    })
    .patch((req: Request, res: Response) => {
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
    .delete((req: Request, res: Response) => {
      return Note
        .findById(req.params.noteId)
        .then((note) => {
          if (!note) {
            return res.status(404).send(notFoundMessage);
          }
          return note
            .destroy()
            .then(() => res.status(204).send())
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    });
}