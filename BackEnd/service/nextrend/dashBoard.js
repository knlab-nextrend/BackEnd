const db = require("../../models/nextrend/index");

const selectHostNation = () => new Promise((resolve,reject)=>{
    const query = 'select a.idx as host_idx, a.host, b.ct_nm as country from nt_hosts a join nt_categorys b on a.country = b.code where b.type=3 and length(b.code)=6;'
    db.query(query,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const selectWorkLog = (docStat,workType,host,range) => new Promise((resolve,reject)=>{
    let query;
    if(host){
        query = 'select count(*) as dcCount from nt_edit_log where doc_stat in '+docStat+' and work_type=? and host in '+host+' and '+range;
    }else{
        query = 'select count(*) as dcCount from nt_edit_log where doc_stat in '+docStat+' and work_type=? and '+range;
    }
    const params = [workType];
    console.log(query);
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
})

module.exports={
    selectHostNation:selectHostNation,
    selectWorkLog:selectWorkLog
}