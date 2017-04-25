/* @flow */

/* External dependencies */
import http from 'http';

/* Internal dependencies */
import server from '../index';
import db from '../models';

const port = process.env.PORT || 8080;

server.set('port', port);

db.sequelize.sync().then(() => {
    http.createServer(server).listen(port);
});
