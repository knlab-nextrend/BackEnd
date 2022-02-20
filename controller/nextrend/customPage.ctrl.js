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

module.exports = {
    create:createCustomedPageSetting,
    delete:deleteCustomedPageSetting,
    update:updateCustomedPageSetting,
    read:readCustomedPageSetting
}