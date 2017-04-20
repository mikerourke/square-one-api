/* External dependencies */
const pg = require('pg');

/* Internal dependencies */
const insertStatements = require('./sql-inserts');
const config = require('../../src/config/config.json')['development'];

const pgConfig = {
    user: config.username,
    database: config.database,
    password: config.password,
    host: config.host,
    port: config.port,
    max: 10,
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(pgConfig);

pool.on('error', (error, client) => {
    console.error('Idle client error', error.message, error.stack);
});

const getPromiseInserts = (client) =>
    insertStatements.map(insertStatement => {
        const { text, values } = insertStatement;
        return new Promise((resolve) => {
            client.query(text, values, (error, result) => resolve());
        });
    });

pool.connect((error, client, done) => {
    if (error) {
        return console.error('Error fetching from client pool', error);
    }

    const promiseInserts = getPromiseInserts(client);
    Promise.all(promiseInserts).then(values => {
        console.log(values);
        done();
    });
});