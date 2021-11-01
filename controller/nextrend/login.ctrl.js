const db = require("../../configs/db");
const crypto = require("crypto");
const jwt = require("../../modules/jwt");

//ToDo : jwt로 access/refresh token 발급하여 보안 강화
//https://cotak.tistory.com/102
//https://velopert.com/2448
//const jwt = require('jsonwebtoken');

const loginAttempt = (req, res) => {
  res.send({ data: "data" });
};

const loginHashPW = (req, res) => {
  crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString("base64");
    //console.log("salt :: ", salt);
    crypto.pbkdf2(req.body.userPW, salt, 1203947, 64, "sha512", (err, key) => {
      if (err) {
        res.send(err);
      } else {
        //console.log("password :: ", key.toString("base64"));
        res.send({ salt: salt, PW: key.toString("base64") });
      }
    });
  });
};

const loginOnLogin = (req, res) => {
  const sql =
    'SELECT ifnull(`userPW`, NULL) AS `userPW`, ifnull(`salt`, NULL) AS `salt`, ifnull(`Category`, NULL) AS `Category` FROM `nt_users_list` RIGHT OUTER JOIN (SELECT "") AS `nt_users_list` ON `userID` = ?';
  const param = [req.body.userID];
  db.query(sql, param, (err, data) => {
    if (!err) {
      if(data[0].userPW === null){
        res.status(401);
        res.send();
      }else{
        crypto.pbkdf2(req.body.userPW,data[0].salt,1203947,64,"sha512", async (err, key) => {
          if(err){
            res.status(401);
            res.send()
          }else{
            if(key.toString("base64") === data[0].userPW){
              //아이디, 비밀번호 일치 시 token과 uid 발급
              const user = {
                userID:req.body.userID,
                Category:data[0].Category
              }
              const jwtToken = await jwt.sign(user);
              console.log(jwtToken);
              res.send({
                uid:data[0].id,
                token:jwtToken
              });
            }else{
              //불일치 시 401 에러 전송
              res.status(401);
              res.send();
            }
          }
        });
      }
    } else {
      res.status(401);
      res.send(err);
    }
  });
};

module.exports = {
  Attempt: loginAttempt,
  HashPW: loginHashPW,
  OnLogin: loginOnLogin,
};
