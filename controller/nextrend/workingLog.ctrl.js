const db = require("../../models/nextrend/index");

/*
workType
1: 조회, 2: 이관, 3: 수정, 4: 보류, 5: 삭제
*/
const addLogEdit = (wid, esId, docStat, workType ) => new Promise((resolve,reject)=>{
    const query = 'insert into nt_edit_log (wid, es_id, doc_stat, work_type) values (?,?,?,?);'
    const params = [wid,esId,docStat,workType];
    db.query(query, param, (err,data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

module.exports = {
    addLog : addLogEdit,
}

