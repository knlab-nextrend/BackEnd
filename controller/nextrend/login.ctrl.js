const db = require("../../models/nextrend/index");
const crypto = require("crypto");
const jwt = require("../../modules/jwt");
const redisClient = require("../../modules/redis");

const loginHashPW = (userPW) => new Promise((resolve, reject)=>{
  crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString("base64");
    //console.log("salt :: ", salt);
    crypto.pbkdf2(userPW, salt, 1203947, 64, "sha512", (err, key) => {
      if (err) {
        resolve(false);
      } else {
        //console.log("password :: ", key.toString("base64"));
        resolve({salt: salt, PW: key.toString("base64")});
      }
    });
  });
});

const loginOnLogin = (userId,userPw) => new Promise((resolve, reject)=>{
  const sql =
    'SELECT id, ifnull(`NAME`,NULL) as `NAME`, ifnull(`userPW`, NULL) AS `userPW`, ifnull(`salt`, NULL) AS `salt`, ifnull(`Category`, NULL) AS `Category` FROM `nt_users_list` RIGHT OUTER JOIN (SELECT "") AS `nt_users_list` ON `userID` = ?';
  const param = [userId];
  db.query(sql, param, (err, data) => {
    if (!err) {
      if(data[0].userPW === null){
        resolve({message:"no matched user information"});
      }else{
        crypto.pbkdf2(userPw,data[0].salt,1203947,64,"sha512", async (err, key) => {
          if(err){
            resolve( {message:"crypto error occured"});
          }else{
            if(key.toString("base64") === data[0].userPW){
              //아이디, 비밀번호 일치 시 token과 uid 발급

              // user의 category를 가져와 payload에 포함시킴.
              const user = {
                userID:userId,
                Category:data[0].Category
              }
              const jwtToken = await jwt.sign(user);
              const refreshToken = await jwt.refresh();
              

              // 발급한 refreshToken과 userID를 redis에 저장..
              redisClient.set(user.userID, refreshToken);
              resolve({
                name:data[0].NAME,
                uid:data[0].id,
                token:jwtToken,
                refreshToken:refreshToken,
                permission:data[0].Category
              });
            }else{
              //불일치 시 401 에러 전송
              resolve( {message:"incorrect pw"});
            }
          }
        });
      }
    } else {
      resolve( {message:"mysql err during on login"});
    }
  });
});

module.exports = {
  HashPW: loginHashPW,
  OnLogin: loginOnLogin,
};
