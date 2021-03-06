const db = require("../../models/nextrend/index");

/*
처음에 했던 await / async 방식은 then과 catch에 걸리는 return 값을 따로 명시해주지 못했지만
객체로 만드는 방법은 resolve와 reject를 통해 명시가 가능하기에 await로 잡을 수 있음
*/
const verifyUserId = (uid,userId) =>new Promise((resolve, reject)=>{
    let query, param;
    if(uid){
        query = "select * from nt_users_list where userID=? and (not id=?);";
        param = [userId,uid];
    }else{
        query = "select * from nt_users_list where userID=?";
        param = [userId];
    }
    db.query(query, param, (err,data) => {
        if(err){
            reject(false);
        }else{
            resolve(data);
        }
    });
});

const restrcitUserByUid = (uid,value) => new Promise((resolve, reject)=>{
    const query = "UPDATE nt_users_list SET stat = ? where id=?"
    const param = [value,uid];
    db.query(query, param, (err,data) => {
        if(err){
            reject(false);
        }else{
            resolve(data);
        }
    });
});

const getUserByUid = (userID) => new Promise((resolve, reject)=>{
    const query = "select * from nt_users_list where userID=?";
    const param = [userID];
    db.query(query, param, (err,data) => {
        if(err){
            reject(false);
        }else{
            const result = data[0];
            resolve(result);
        }
    });
})

const addUser = (Info) => new Promise((resolve, reject)=>{
    const query = "INSERT INTO nt_users_list (userID,userPW,Name,Company,Position,Email,Tel,Category,salt) VALUES (?,?,?,?,?,?,?,?,?)";
    const param = [Info.ID,Info.PW,Info.Name,Info.Company,Info.Position,Info.Email,Info.Tel,Info.Category,Info.salt];
    db.query(query, param, (err,data) => {
        if(err){
            resolve( false);
        }else{
            resolve( true);
        }
    });
});

const listAllUser = () => new Promise((resolve, reject)=>{
    const query = "select * from nt_users_list";
    db.query(query, (err,data) => {
        if(err){
            resolve(false);
        }else{
            resolve(data);
        }
    });
});

const modifyUser = (Info,uid) => new Promise((resolve, reject)=>{
    const query = "UPDATE nt_users_list SET userID = ?, userPW = ?, Name = ?, Company = ?, Position = ?, Email = ?, Tel = ?, Category = ?, salt = ? WHERE id = ?";
    const param = [Info.ID,Info.PW,Info.Name,Info.Company,Info.Position,Info.Email,Info.Tel,Info.Category,Info.salt,uid];
    db.query(query, param, (err,data) => {
        if(err){
            resolve(false);
        }else{
            resolve(true);
        }
    });
});

const deleteUser = (uid) => new Promise((resolve, reject)=>{
    const query = "delete from nt_users_list where id = ?";
    const param = [uid];
    db.query(query, param, (err,data) => {
        if(err){
            resolve(false);
        }else{
            resolve(true);
        }
    });
});

module.exports = {
    getUserByUid:getUserByUid,
    Add: addUser,
    List: listAllUser,
    Modify: modifyUser,
    Delete:deleteUser,
    Restrict:restrcitUserByUid,
    Verify:verifyUserId
}