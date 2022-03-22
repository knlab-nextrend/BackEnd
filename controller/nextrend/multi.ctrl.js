const db = require("../../models/nextrend/index");

const readQuery = () => new Promise((resolve,reject)=>{
    const query = 'select * from nt_multilingual;';
    db.query(query,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    })
})

const createQuery = (multi_text, wid) => new Promise((resolve,reject)=>{
    const query = 'insert into nt_multilingual (multi_text, wid) values (?,?)';
    const params = [multi_text,wid];
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    })
})

const updateQuery = (idx, multi_text, wid) => new Promise((resolve,reject)=>{
    const query = 'update nt_multilingual set multi_text=?, wid=?, dt_modi=current_timestamp where idx = ?';
    const params = [multi_text,wid,idx];
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    })
})

const deleteQuery = (idx) => new Promise((resolve,reject)=>{
    const query = 'delete from nt_multilingual where idx = ?;';
    const params = [idx];
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    })
})

module.exports = {
    read : readQuery,
    update : updateQuery,
    create : createQuery,
    delete : deleteQuery
}