/**
 * Assigns handlers to the application router for each entity type.
 */
import { Router } from 'express';
import assignLeadRoutes from './leads';
import assignSettingRoutes from './settings';
import assignUserRoutes from './users';

export default (server) => {
    const router = Router();
    assignLeadRoutes(router);
    assignSettingRoutes(router);
    assignUserRoutes(router);
    server.use('/api', router);
};
