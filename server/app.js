import http from 'http';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

const app = express();

app.use(logger('dev'));

// Parse incoming requests data:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Setup a default catch-all route that sends back a welcome message in JSON
// format:
app.get('*', (req, res) => {
    res.status(200).send({
        message: 'This is the API router.'
    });
});

const port = process.env.PORT || 8000;
app.set('port', port);
http.createServer(app).listen(port);

export default app;