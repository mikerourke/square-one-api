import { Router } from 'express';
import assignLeadRoutes from './leads';
import assignAppointmentRoutes from './appointments';
import assignSettingRoutes from './settings';

export default (app) => {
    const router = Router();
    assignLeadRoutes(router);
    assignAppointmentRoutes(router);
    assignSettingRoutes(router);
    app.use('/api', router);
};