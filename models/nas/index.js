const Client = require('ftp');
const path = require('path');
const NasFTP = new Client();
const dbtype = process.env.NODE_ENV || 'nas';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];
NasFTP.connect(config)

module.exports = NasFTP;