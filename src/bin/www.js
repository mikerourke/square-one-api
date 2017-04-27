/* @flow */

/* External dependencies */
import http from 'http';

/* Internal dependencies */
import app from '../index';
import db from '../models';

const port = process.env.PORT || 8080;

app.set('port', port);

db.sequelize.sync().then(() => {
    http.createServer(app).listen(port);
});
