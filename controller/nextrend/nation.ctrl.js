const db = require("../../configs/db");

const getCountry = (conti) => {
    const query = "SELECT * FROM login.nt_countrys a join login.nt_continents b  on  a.conti_idx = b.idx where b.idx = ?";
    const param = [conti];
    db.query(query,param,(err,data)=>{
        if(err){
            return false;
        }else{
            const result = data[0];
            return result;
        }
    })
}

const getContinent = () => {
    const query = "select * from nt_continents";
    db.query(query, (err,data) => {
        if(!err){
            return data;
        }else{
            return false;
        }
    });
}

module.exports = {
    getConti = getContinent,
    getCountry = getCountry
}