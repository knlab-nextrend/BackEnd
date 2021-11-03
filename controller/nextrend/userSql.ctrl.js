const db = require("../../configs/db");

/*
처음에 했던 await / async 방식은 then과 catch에 걸리는 return 값을 따로 명시해주지 못했지만
객체로 만드는 방법은 resolve와 reject를 통해 명시가 가능하기에 await로 잡을 수 있음
*/

const getUserByUid = (uid) => new Promise((resolve, reject)=>{
    const query = "select * from nt_users_list where userID=?";
    const param = [uid];
    db.query(query, param, (err,data) => {
        if(err){
            reject(false);
        }else{
            const result = data[0];
            resolve(result);
        }
    });
})

module.exports = {
    getUserByUid:getUserByUid
}