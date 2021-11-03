const NasFTP = require("../../models/nas/index");
const NasConn = NasFTP.client;

const getFileList = (pathList) => new Promise((resolve,reject) => {
    const fileList = NasConn.client.ls(pathList);
    console.log(fileList);
});

module.exports = {
    getImage:getFileList
}