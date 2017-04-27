/* @flow */

/* External dependencies */
import { Router } from 'express';

/* Internal dependencies */
import assignChangeRoutes from './changes';
import assignLeadRoutes from './leads';
import assignMessageRoutes from './messages';
import assignNoteRoutes from './notes';
import assignSettingRoutes from './settings';
import assignUserRoutes from './users';

/* Types */
import type { Application } from 'express';

/**
 * Assigns handlers to the application router for each entity type.
 */
const assignRoutes = (app: Application) => {
    const router = Router();
    assignLeadRoutes(router);
    assignChangeRoutes(router);
    assignMessageRoutes(router);
    assignNoteRoutes(router);
    assignSettingRoutes(router);
    assignUserRoutes(router);
    app.use('/api', router);
};

export default assignRoutes;