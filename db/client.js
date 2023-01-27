const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'secret',
    password: '1234',
    port: 5432,
});

// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'secret',
//     password: '1234',
//     port: 5432,
// });

// async function sendQuery(query) {
//     try {
//         await client.connect();
//         const resp = await client.query(query);
//         await client.end();

//         return resp;
//     } catch (err) {
//         console.log(JSON.stringify(err.message));
//         console.log(`Some error happened during running SQL query: ${query}`);
//         await client.end();
//     }
// }

async function sendQuery(query) {
    const connection = await pool.connect();

    try {
        const resp = await connection.query(query);
        await connection.release();

        return resp;
    } catch (err) {
        console.log(JSON.stringify(err.message));
        console.log(`Some error happened during running SQL query: ${query}`);
        await connection.release();
    }
}

module.exports = sendQuery;
