
const { Client } = require('@elastic/elasticsearch');
const path = require('path');
const dbtype = process.env.NODE_ENV || 'es';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];
const esDB = new Client({ node: config.host });

module.exports = {
    esDB:esDB,
    config:config
};
