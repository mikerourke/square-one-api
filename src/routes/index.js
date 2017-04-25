/* @flow */

/* External dependencies */
import { Router } from 'express';

/* Internal dependencies */
import assignChangeRoutes from './changes';
import assignLeadRoutes from './leads';
import assignMessageRoutes from './messages';
import assignSettingRoutes from './settings';
import assignUserRoutes from './users';

/* Types */
import type { Router as ExpressRouter } from 'express';

/**
 * Assigns handlers to the application router for each entity type.
 */
const assignRoutes = (server: ExpressRouter) => {
    const router = Router();
    assignLeadRoutes(router);
    assignChangeRoutes(router);
    assignMessageRoutes(router);
    assignSettingRoutes(router);
    assignUserRoutes(router);
    server.use('/api', router);
};

export default assignRoutes;