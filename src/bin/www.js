/**
 * Starting point for the application.  Loads the server and syncs the
 *      database.
 */
import http from 'http';
import server from '../index';
import db from '../models';

const port = process.env.PORT || 8080;

server.set('port', port);

db.sequelize.sync().then(() => {
    http.createServer(server).listen(port);
});
