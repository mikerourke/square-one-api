const pg = require('pg');
const sql = require('sql');

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

// TODO: Finish insert queries for initial setup.

const leads = sql.Table.define({
    name: 'leads',
    columns: ['id', 'createdAt', 'updatedAt']
});

const testQuery = leads.insert(
    leads.id.value(1011704190001),
    leads.createdAt.value('2017-04-19 17:55:59.605 +00:00'),
    leads.updatedAt.value('2017-04-19 17:55:59.605 +00:00')
).toQuery();

pool.on('error', (error, client) => {
    console.error('Idle client error', error.message, error.stack);
});

pool.connect((error, client, done) => {
   if (error) {
       return console.error('Error fetching from client pool', error);
   }

   client.query(testQuery.text, testQuery.values, (error, result) => {
       done(error);

       if (error) {
           return console.error('Error running query', error);
       }

       console.log(result);
   })
});