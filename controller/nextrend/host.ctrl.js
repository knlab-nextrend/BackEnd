const db = require("../../models/nextrend/index");

const readQuery = (param) => new Promise((resolve, reject)=>{
    let query;
    if(typeof param==='number'){
        query =  'select * from nt_hosts where idx = '+param;
    }else if(typeof param==='string'){
        query =  'select * from nt_hosts where host like '+'"%'+param+'%" or name like '+'"%'+param+'%"';
    }else{
        query =  'select * from nt_hosts';
    }
    
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

const getInfo = (host) => new Promise((resolve,reject)=>{
    const query = 'select idx,name,lang, country from nt_hosts where host like "'+host+'"';
    db.query(query,(err,data)=>{
        if(err||data.length==0){
            reject(err)
        }else{
            resolve(data[0]);
        }
    });
})

module.exports={
    create:createQuery,
    read:readQuery,
    getInfo:getInfo
}