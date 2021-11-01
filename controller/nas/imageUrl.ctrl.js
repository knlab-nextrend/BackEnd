const NasFTP = require("../../models/nas/index");
const NasConn = NasFTP.client;

console.dir(NasConn);
const getImgFromFold = async (req,res) => {
    res.send(NasConn.list());
}

module.exports = {
    getImage:getImgFromFold
}