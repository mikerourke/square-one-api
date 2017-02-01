/**
 * Assigns handlers to the application router for each entity type.
 */
import { Router } from 'express';
import assignLeadRoutes from './leads';
import assignAppointmentRoutes from './appointments';
import assignSettingRoutes from './settings';
import assignUserRoutes from './users';

export default (app) => {
    const router = Router();
    assignLeadRoutes(router);
    assignAppointmentRoutes(router);
    assignSettingRoutes(router);
    assignUserRoutes(router);
    app.use('/api', router);
};
