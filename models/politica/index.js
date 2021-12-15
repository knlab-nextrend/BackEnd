const path = require('path');
const dbtype = process.env.NODE_ENV || 'politica';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];

const mysql = require('mysql');
const db = mysql.createPool({
    host: config.host,
    user: config.username,
    acquireTimeout: 20000,
    password: config.password,
    database: config.database,
    multipleStatements: true
});

module.exports = db;
