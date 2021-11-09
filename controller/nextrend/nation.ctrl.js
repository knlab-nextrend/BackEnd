const db = require("../../models/nextrend/index");

const getCountry = (conti) => new Promise((resolve, reject)=>{
    const query = "SELECT * FROM login.nt_countrys a join login.nt_continents b  on  a.conti_idx = b.idx where b.idx = ?";
    const param = [conti];
    db.query(query,param,(err,data)=>{
        if(err){
            resolve(false);
        }else{
            const result = data[0];
            resolve(result);
        }
    })
});

const getContinent = () => new Promise((resolve, reject)=>{
    const query = "select * from nt_continents";
    db.query(query, (err,data) => {
        if(!err){
            resolve(data);
        }else{
            resolve(false);
        }
    });
});

module.exports = {
    getConti:getContinent,
    getCountry:getCountry
}