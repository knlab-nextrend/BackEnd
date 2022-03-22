const db = require("../../models/nextrend/index");

const readQuery = () => new Promise((resolve, reject)=>{
    let query =  'select * from nt_hosts';
    db.query(query,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const createQuery = (host,name,category,country,lang,workCycle) => new Promise((resolve, reject)=>{
    const query = 'insert into nt_hosts (`HOST`,`NAME`,`CATEGORY`,`COUNTRY`,`LANG`,`WORK_CYCLE`) values (?,?,?,?,?,?)';
    const params = [host,name,category,country,lang,workCycle];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

module.exports={
    create:createQuery,
    read:readQuery,
}