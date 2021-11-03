//const ftp = require('basic-ftp');
const jsftp = require("jsftp");

const path = require('path');
const dbtype = process.env.NODE_ENV || 'nas';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];

const ftpConnection = {
    client : new jsftp(config),
    thumbRoute:"/GPS/pdf/files/thumbnail/",
    pdf_route:"/GPS/pdf/files/archived/",
}

module.exports = {
    client:ftpConnection
};
