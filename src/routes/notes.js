/**
 * Assigns routes for Note entities to the application router.
 */
import { Note } from '../models';

const assignNoteRoutes = (router) => {
    router
        .route('/leads/:leadId/notes')
        .get((req, res) => {

        });
};

export default assignNoteRoutes;
