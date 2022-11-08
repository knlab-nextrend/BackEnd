const db = require("../../models/nextrend/index");

const readQuery = (length, type, code = null) =>
  new Promise((resolve, reject) => {
    let query =
      "select * from nt_categorys where length(`CODE`)=? and type=? and stat<9";
    const params = [length, type];
    if (code) {
      query += ' and `CODE` like "' + code + '%";';
    }

    db.query(query, params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const getCodeByType = (type) =>
  new Promise((resolve, reject) => {
    let query = `SELECT CT_NM as name, CODE as code, IDX FROM nt_categorys WHERE TYPE=${type}`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const list = result.map((category) => {
          if (category.code.length === 2) {
            return { ...category, type, level: "대분류" };
          } else if (category.code.length === 4) {
            return { ...category, type, level: "중분류" };
          } else if (category.code.length === 6) {
            return { ...category, type, level: "소분류" };
          } else {
            return { ...category, type, level: "미분류" };
          }
        });
        resolve(list);
      }
    });
  });

const createQuery = (length, type, ct_nm, code) =>
  new Promise((resolve, reject) => {
    const query = "call setLimitCat(?,?,?,?)";
    const params = [type, code, length, ct_nm];

    db.query(query, params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const updateQuery = (type, code, ct_nm) =>
  new Promise((resolve, reject) => {
    const query =
      "update login.nt_categorys set CT_NM=? where type=? and code=?;";
    const params = [ct_nm, type, code];

    db.query(query, params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const deleteQuery = (type, code) =>
  new Promise((resolve, reject) => {
    const query =
      "delete from nt_categorys where type=? and code like '" + code + "%'";
    const params = [type];

    db.query(query, params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

module.exports = {
  create: createQuery,
  read: readQuery,
  update: updateQuery,
  delete: deleteQuery,
  getCodeByType: getCodeByType,
};
