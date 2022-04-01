const db = require("../../models/politica/index");
const dayjs = require("dayjs");

//수정 요망... 핑테스트로 재구현
const checkStat = (itemId)=> new Promise((resolve, reject) => {
    const param = [itemId];
    const query = "select * from collected_item where item_id=?";
    db.query(query, param,(err, data) => {
        if (err) {
            resolve(false);
        } else {
            if(data.length==0){
                resolve(false);
            }else{
                resolve(true);
            }
        }
    })
})

const modSubmitStat = (itemId) => new Promise((resolve, reject) => {
    const date = dayjs().locale('se-kr').format().split('+')[0];
    const param = [date,itemId];
    const query = "update collected_item set submit_status=1, submint_time=? where item_id=?";
    db.query(query, param,(err, data) => {
        if (err) {
            resolve(false);
        } else {
            resolve(data);
        }
    })
})

const insertUploadData = (itemId,dc_page) => new Promise((resolve, reject) => {
    const date = dayjs().locale('se-kr').format().split('+')[0];
    const param = [date,date,date,dc_page,itemId];
    const query = "insert into collected_item (job_id,table_name,download_status,solr_status,submit_status,download_time,solr_time,submint_time,solr_page,item_id) values (-1,'crawler_item',1,1,1,?,?,?,?,?)";
    db.query(query, param,(err, data) => {
        if (err) {
            resolve(false);
        } else {
            resolve(data);
        }
    })
})

const getHostListInfo = () => new Promise((resolve,reject)=>{
    const query = "select * from crawler_host";
    db.query(query,(err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
})

const getCrawlerLog = () => new Promise((resolve,reject)=>{
    const query ='select sum(html) as html, sum(url) as url, sum(pdf) as pdf, sum(word) as word, sum(excel) as excel, sum(ppt) as ppt, sum(etc) as etc from crawler_log;'
    db.query(query,(err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
})

const getHostWorkLog = (hid) => new Promise((resolve,reject)=>{
    const query ='select * from crawler_host h inner join crawler_log l on h.host = l.host where h.host_id = ?;'
    const params = [hid]
    db.query(query,params,(err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
})

module.exports = {
    modSubmitStat:modSubmitStat,
    checkStat:checkStat,
    insertUploadData:insertUploadData,
    getHostListInfo:getHostListInfo,
    getCrawlerLog:getCrawlerLog,
    getHostWorkLog:getHostWorkLog
}