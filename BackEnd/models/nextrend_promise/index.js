const path = require('path');
const dbtype = process.env.NODE_ENV || 'nextrend';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];

const mysql = require('mysql2/promise');
const db = mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    multipleStatements: true
});
//pool.query() = pool.getConnection() + connection.query() + connection.release()

module.exports = db;
