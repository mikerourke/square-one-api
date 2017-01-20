import http from 'http';
import app from '../app';
import db from '../models';

const port = process.env.PORT || 8080;

app.set('port', port);

db.sequelize.sync().then(() => {
    http.createServer(app).listen(port);
});