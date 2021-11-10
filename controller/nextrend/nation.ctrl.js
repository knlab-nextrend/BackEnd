const db = require("../../models/nextrend/index");

const getCountry = (conti) => new Promise((resolve, reject)=>{
    const query = "SELECT a.idx,a.cty_name,a.conti_idx,a.cty_pri FROM nt_countrys a join nt_continents b  on  a.conti_idx = b.idx where a.conti_idx = ?";
    const param = [conti];
    db.query(query,param,(err,data)=>{
        if(err){
            resolve(false);
        }else{
            const result = data;
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