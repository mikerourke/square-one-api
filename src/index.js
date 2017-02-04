import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import assignRoutes from './routes';

const server = express();

// Assign middlewares:
server.use(logger('dev'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Setup routes:
assignRoutes(server);

// Serve up the front end:
server.use('/', express.static(path.resolve(__dirname, 'client')));

// Setup a default catch-all route that sends back a welcome message in JSON
// format:
server.get('*', (req, res) => {
    res.status(200).send({
        message: 'This is the API router.',
    });
});

export default server;
