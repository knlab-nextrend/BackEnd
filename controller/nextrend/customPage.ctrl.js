const db = require("../../models/nextrend/index");

const createCustomedPageSetting = (uid, xaxis, yaxis, wid) => new Promise((resolve,reject) => {
    const query = 'INSERT INTO `nt_customed_cat` (`UID`,`AXIS_X`,`AXIS_y`,`MODI_USER`) VALUES (?,?,?,?);';
    const params = [uid,xaxis,yaxis,wid];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const updateCustomedPageSetting = (idx, uid, xaxis, yaxis, wid) => new Promise((resolve,reject) => {
    const query = 'UPDATE `nt_customed_cat` SET `UID` = ?,`AXIS_X` = ?,`AXIS_y` =?, `MODI_USER` = ?, `DT_MODI` = CURRENT_TIMESTAMP WHERE `IDX` = ?;';
    const params = [uid,xaxis,yaxis,wid,idx];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const deleteCustomedPageSetting = (idx) => new Promise((resolve,reject) => {
    const query = 'DELETE FROM `nt_customed_cat` WHERE `IDX` = ?;';
    const params = [idx];

    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const readCustomedPageSetting = () => new Promise((resolve,reject) => {
    const query = 'select a.idx, a.uid, a.dt_added,a.dt_modi,a.stat,b.type as x_type, b.ct_nm as x_name,c.type as y_type, c.ct_nm as y_name,d.name as modi_user from nt_customed_cat a left join nt_categorys b on a.axis_x = b.idx left join nt_categorys c on a.axis_y = c.idx left join nt_users_list d on a.modi_user = d.id;';

    db.query(query,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
});

const testAxis = (cid) => new Promise((resolve,reject)=>{
    const query = 'select cat.type,cat.ct_nm,cat.code from nt_categorys cat inner join (select type,code from nt_categorys where idx = ?) tg on cat.type = tg.type and cat.code like concat(tg.code,"%") and cat.code!=tg.code;'
    const params=[cid];
    db.query(query,params,(err,data)=>{
        if(err||data.length===0){
            reject({message:"no exist category setting for this user"});
        }else{
            resolve(data);
        }
    });
})

const callUnderCatList = (uid,axis) => new Promise((resolve,reject)=>{
    const query = 'select cat.type,cat.ct_nm,cat.code from nt_categorys cat inner join  (select a.type,a.code from nt_categorys a inner join nt_customed_cat b on a.idx = b.'+axis+' where b.uid = ?) tg on cat.type = tg.type and cat.code like concat(tg.code,"%") and cat.code!=tg.code;';
    const params=[uid];

    db.query(query,params,(err,data)=>{
        if(err||data.length===0){
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