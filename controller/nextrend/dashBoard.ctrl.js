const db = require("../../models/nextrend/index");

const selectHostNation = () => new Promise((resolve,reject)=>{
    const query = 'select a.idx as host_idx, a.host, b.ct_nm as country from nt_hosts a join nt_categorys b on a.country = b.code where b.type=3;'
    db.query(query,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

module.exports={
    selectHostNation:selectHostNation
}