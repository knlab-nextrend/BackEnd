
const { Client } = require('@elastic/elasticsearch');
const path = require('path');
const dbtype = process.env.NODE_ENV || 'els';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];
const elsDB = new Client({ node: config.host });

module.exports = elsDB;