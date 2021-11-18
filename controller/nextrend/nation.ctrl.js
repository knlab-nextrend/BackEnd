const db = require("../../models/nextrend/index");

const getCountry = (conti) => new Promise((resolve, reject)=>{
    const query = "SELECT a.IDX,a.CTY_NAME,a.CONTI_IDX,a.CTY_PRI FROM nt_countrys a join nt_continents b  on  a.conti_idx = b.idx where a.conti_idx = ?";
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

const getCountryById = (id) => new Promise(async (resolve,reject)=>{
    const query = "SELECT a.IDX,a.CTY_NAME,a.CONTI_IDX,a.CTY_PRI from nt_countrys a where idx = ?";
    const param = [id];
    await db.query(query,param, (err,data) => {
        if(!err){
            resolve(data);
        }else{
            resolve(false);
        }
    });
});

// 좀 애매한 함수... id 여러개에 대한 검색이니까..
const countryConverter = (countrys) => new Promise(async (resolve,reject)=>{
    const results = [];
    countrys.forEach(async(countryId)=>{
        const query = "select * from nt_countrys where idx = ?";
        const param = [countryId];
        await db.query(query,param, (err,data) => {
            if(!err){
                results.push(data);
            }else{
            }
        });
    });
    if(results.length){
        resolve(results);
    }else{
        resolve(false);
    }
});

module.exports = {
    getConti:getContinent,
    getCountry:getCountry,
    getCountryById:getCountryById,
    countryConverter:countryConverter
}