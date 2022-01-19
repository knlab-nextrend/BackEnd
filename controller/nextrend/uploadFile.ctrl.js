const db = require("../../models/nextrend/index");

const checkUploadTable = () => new Promise((resolve, reject) => {
    const query = "create table if not exists nt_uploaded_files ( `IDX` int(10) unsigned NOT NULL AUTO_INCREMENT, `_ID` varchar(64), `FILE_NAME` varchar(50) NOT NULL ,`DT` datetime DEFAULT CURRENT_TIMESTAMP,`UID` int(10) unsigned NOT NULL,PRIMARY KEY (`IDX`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;";
    db.query(query, (err, data) => {
        if (err) {
            resolve(err);
        } else {
            resolve(false);
        }
    })
});

const getItemIdAsStored = () => new Promise((resolve, reject) => {
    const query = "SELECT count(*) FROM nt_uploaded_files;";
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
            resolve(false);
        } else {
            resolve(data[0]['count(*)']+1);
        }
    })
});

const insertUploadedFile = (filename,uid) => new Promise((resolve, reject) => {
    const query = "insert into nt_uploaded_files (file_name, uid) values (?,?)";
    const params = [filename,uid];
    db.query(query,params, (err, data) => {
        if (err) {
            resolve(false);
        } else {
            resolve(data); 
        }
    })
});

const updateId = (_id,idx) => new Promise((resolve, reject) => {
    const query = "update nt_uploaded_files set (_id=?) where idx=?";
    const params = [_id,idx];
    db.query(query,params, (err, data) => {
        if (err) {
            resolve(false);
        } else {
            resolve(data); 
        }
    })
});

module.exports = { 
    checkUploadTable: checkUploadTable,
    getItemIdAsStored:getItemIdAsStored,
    insertUploadedFile:insertUploadedFile,
    updateId:updateId
};