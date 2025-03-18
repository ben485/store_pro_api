const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'sql5.freesqldatabase.com',
    user: 'sql5767533',
    password: 'x96L7a5PtD',
    database: 'sql5767533',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



module.exports = pool;