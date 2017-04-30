/* @flow */

/* External dependencies */
import { Router } from 'express';
import passport from 'passport';

/* Internal dependencies */
import assignAuthRoutes from './auth';
import assignChangeRoutes from './changes';
import assignLeadRoutes from './leads';
import assignMessageRoutes from './messages';
import assignNoteRoutes from './notes';
import assignSettingRoutes from './settings';
import assignUserRoutes from './users';

/* Types */
import type { Application } from 'express';

const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * Assigns handlers to the application router.
 */
const assignRoutes = (app: Application) => {
    const authRouter = Router();
    assignAuthRoutes(authRouter);
    app.use('/api/auth', authRouter);

    const apiRouter = Router();
    apiRouter.use(requireAuth);
    assignLeadRoutes(apiRouter);
    assignChangeRoutes(apiRouter);
    assignMessageRoutes(apiRouter);
    assignNoteRoutes(apiRouter);
    assignSettingRoutes(apiRouter);
    assignUserRoutes(apiRouter);
    
    app.use('/api', apiRouter);
};

export default assignRoutes;
