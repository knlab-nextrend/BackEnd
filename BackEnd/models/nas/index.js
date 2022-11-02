//const ftp = require('basic-ftp');

const path = require('path');
const dbtype = process.env.NODE_ENV || 'nas';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];

module.exports = {
    thumbRoute:"/GPS/pdf/files/thumbnail/",
    pdfRoute:"/GPS/pdf/files/archived/",
    uploadRoute:"/GPS/pdf/upload_files/",
    userLogoRoute : "/GPS/pdf/files/thumbnail/files/user/logo/",
    webServer:config.host+":"+config.webport,
    config:config
};
