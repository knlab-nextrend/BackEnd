const db = require("../../models/nextrend/index");

const createCustomedPageSetting = (uid, cid, type, wid) => new Promise((resolve,reject) => {
    const query = 'INSERT INTO `nt_customed_axis_list` (`UID`,`CID`,`TYPE`, `MODI_USER`) VALUES (?,?,?,?);';
    const params = [uid,cid,type,wid];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const updateCustomedPageSetting = (uid, xaxis, yaxis, wid) => new Promise((resolve,reject) => {
    const query = 'UPDATE `nt_customed_cat` SET `UID` = ?,`AXIS_X` = ?,`AXIS_y` =?, `MODI_USER` = ?, `DT_MODI` = CURRENT_TIMESTAMP WHERE `UID` = ?;';
    const params = [uid,xaxis,yaxis,wid,uid];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const deleteCustomedPageSetting = (idx) => new Promise((resolve,reject) => {
    const query = 'DELETE FROM nt_customed_axis_list  WHERE idx = ?;';
    const params = [idx];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const readCustomedPageSetting = (uid, type) => new Promise((resolve,reject) => {
    const query = `select a.idx, a.uid, a.dt_added , a.dt_modi , a.type, a.CID, 
    b.code as x_code, b.type as x_type, b.ct_nm as ct_name 
    from nt_customed_axis_list a left join nt_categorys b on a.CID = b.idx where a.uid=? and a.type=?;
    `
    
    const params = [uid, type];

    db.query(query,params,(err,data)=>{
        if(err){
            console.log(err);
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const testAxis = (uid) => new Promise((resolve,reject)=>{
    const query = 
    `SELECT a.idx, a.cid, b.type, b.ct_nm, b.code, a.axis 
    FROM (SELECT idx, cid, type as axis FROM nt_customed_axis_list WHERE uid=?) a LEFT JOIN nt_categorys b ON a.cid = b.idx`; 
    const params=[uid];
    db.query(query,params,(err,data)=>{
        if(err||data.length===0){
            reject({message:"no exist category setting for this user"});
        }else{
            xaxis = []
            yaxis = []
            data.forEach(element => {
                if(element["axis"] == 0) xaxis.push(element)
                else yaxis.push(element)
                delete element["type"]
            });

            resolve({"x_axis" : xaxis, "y_axis" : yaxis});
        }
    });
})

//deprecated
const callUnderCatList = (uid,axis) => new Promise((resolve,reject)=>{
    const query = 'select cat.type,cat.ct_nm,cat.code from nt_categorys cat inner join  (select a.type,a.code from nt_categorys a inner join nt_customed_cat b on a.idx = b.'+axis+' where b.uid = ?) tg on cat.type = tg.type and cat.code like concat(tg.code,"%") and length(cat.code)=length(tg.code)+2 and cat.code!=tg.code;';
    const params=[uid];

    db.query(query,params,(err,data)=>{
        if(err){
            reject({message:"no exist category setting for this user"});
        }else{
        
            resolve(data);
        }
    });
})

module.exports = {
    create:createCustomedPageSetting,
    delete:deleteCustomedPageSetting,
    update:updateCustomedPageSetting,
    read:readCustomedPageSetting,
    call:callUnderCatList,
    test:testAxis
}