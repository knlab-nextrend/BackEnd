const db = require("../../models/nextrend/index");

const readQuery = (length,type,code=null) => new Promise((resolve, reject)=>{
    let query =  'select * from nt_categorys where length(`CODE`)=? and type=? and stat<9';
    const params=[length,type];
    if(code){
        query += ' and `CODE` like "'+code+'%";';
    }

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const createQuery = (length,type,ct_nm) => new Promise((resolve, reject)=>{
    const query = 'insert into login.nt_categorys (type,ct_nm,code) values(?,?, (select temp.* from (select max(code)+1 from login.nt_categorys where type=? and length(code)=?) temp));';
    const params = [type,ct_nm,type,length];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const updateQuery = (type, code, ct_nm) => new Promise((resolve, reject)=>{
    const query = 'update login.nt_categorys set CT_NM=? where type=? and code=?;'
    const params = [ct_nm,type,code];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const deleteQuery = (type, code) => new Promise((resolve, reject)=>{
    const query = 'update login.nt_categorys set stat=9 where type=? and code=?;';
    const params = [type,code];

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
    update:updateQuery,
    delete:deleteQuery
}