import http from 'http';
import app from '../app';
import db from '../models/index';

const port = process.env.PORT || 8000;
app.set('port', port);

db.sequelize.sync().then(() => {
    http.createServer(app).listen(port);
});