const db = require("../../configs/db");
const crypto = require("crypto");

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
    crypto.pbkdf2(req.query.userPW, salt, 1203947, 64, "sha512", (err, key) => {
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
  console.log(req);
  //jwt 토큰 발급
  //const secret = req.app.get('jwt-secret');

  const sql =
    'SELECT ifnull(`userPW`, NULL) AS `userPW`, ifnull(`salt`, NULL) AS `salt`, ifnull(`Category`, NULL) AS `Category` FROM `nt_users_list` RIGHT OUTER JOIN (SELECT "") AS `nt_users_list` ON `userID` = ?';
  const param = [req.query.userID];
  db.query(sql, param, (err, data) => {
    if (!err) {
      if (data[0].salt !== null) {
        crypto.pbkdf2(
          req.query.userPW,
          data[0].salt,
          1203947,
          64,
          "sha512",
          (err, key) => {
            console.log(
              "비밀번호 일치 여부 :: ",
              key.toString("base64") === data[0].userPW
            );
            // true : 아이디, 비밀번호 일치, false : 아이디 일치, 비밀번호 불일치
            res.send({
              result: key.toString("base64") === data[0].userPW,
              Category: data[0].Category,
            });
          }
        );
      } else {
        // null : 아이디 불일치
        res.send({ result: data[0].salt });
      }
    } else {
      res.send(err);
    }
  });
};

module.exports = {
  Attempt: loginAttempt,
  HashPW: loginHashPW,
  OnLogin: loginOnLogin,
};
