const NasFTP = require("../../models/nas/index");
const NasConn = NasFTP.client;

const getFileList = async (pathList) => {
    return NasConn.client.ls(pathList,(err,data)=>{
        data.forEach(file => console.log(file.name));
    });
}

module.exports = {
    getImage:getFileList
}