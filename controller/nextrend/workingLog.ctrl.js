const db = require("../../models/nextrend/index");

/*
workType
1: 조회, 2: 이관, 3: 수정, 4: 보류, 5: 삭제
*/
const addEditLog = (wid, esId, docStat, workType ) => new Promise((resolve,reject)=>{
    const query = 'insert into nt_edit_log (wid, es_id, doc_stat, work_type) values (?,?,?,?);'
    const params = [wid,esId,docStat,workType];
    db.query(query, params, (err,data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

const addScreeningLog = (wid, docStat, workType, quantity )=> new Promise((resolve,reject)=>{
    const query = 'insert into nt_screen_log (wid, doc_stat, work_type, quantity) values (?,?,?,?);'
    const params = [wid,docStat,workType,quantity];
    db.query(query, params, (err,data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

// 큐레이션의 경우 동작은.. 수정과 이관이 있을 것임. 하지만 정량 체크가 우선이기에 관련 정보는 nt_edit_log에서 관리.
const addCurationLog = (wid, esId, quality, quantity)=> new Promise((resolve,reject)=>{
    const query = 'insert into nt_curation_log (wid, es_id, quality, quantity) values (?,?,?,?);'
    const params = [wid,esId,quality,quantity];
    db.query(query, params, (err,data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

module.exports = {
    addEditLog : addEditLog,
    addScreeningLog : addScreeningLog,
    addCurationLog : addCurationLog,
}

