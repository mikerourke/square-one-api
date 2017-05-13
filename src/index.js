/* @flow */

/* External dependencies */
import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

/* Internal dependencies */
import './lib/authentication';
import assignRoutes from './routes';

const app = express();

// Assign middlewares:
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup routes:
assignRoutes(app);

// Serve up the front end:
app.use('/', express.static(path.resolve(__dirname, 'client')));

// Setup a default catch-all route that sends back a welcome message in JSON
// format:
app.get('*', (req, res) => {
  res.status(200).send({ message: 'This is the API router.' });
});

export default app;
