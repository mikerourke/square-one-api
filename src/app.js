import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import assignRoutes from './routes';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
assignRoutes(app);

// Setup a default catch-all route that sends back a welcome message in JSON
// format:
app.get('*', (req, res) => {
    res.status(200).send({
        message: 'This is the API router.'
    });
});

export default app;