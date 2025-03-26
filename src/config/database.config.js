const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'pharmacysystem.cjciuwoi005p.eu-north-1.rds.amazonaws.com',
    user: 'datasus',
    password: 'Dubaduba6060',
    database: 'pharmacysystem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000 // 30 seconds
});



module.exports = pool;