const db = require("../../models/nextrend/index");

const codesToDict = ()  => new Promise((resolve, reject)=>{
    const Lq =  'select * from nt_categorys where length(`CODE`)=2 and type=1 and stat<9; ';
    const Mq =  'select * from nt_categorys where length(`CODE`)=4 and type=1 and stat<9; ';
    const Sq =  'select * from nt_categorys where length(`CODE`)=6 and type=1 and stat<9; ';

    db.query(Lq+Mq+Sq, (err,data) => {
        if(!err){
            var large = data[0];
            var middle = data[1];
            var small = data[2];

            const allCategorys = [];

            large.forEach(lcat => {
                allCategorys.push({
                    value:lcat['CODE'],
                    label:lcat['CT_NM'],
                    children:[]
                })
            });
            middle.forEach(mcat =>{
                var lcode = mcat['CODE'].substr(0,2);
                allCategorys.forEach(largecat => {
                    if(largecat['value']===lcode){
                        largecat['children'].push({
                            value:mcat['CODE'],
                            label:mcat['CT_NM'],
                            children:[]
                        })
                    }
                })
            })
            small.forEach(scat => {
                var lcode = scat['CODE'].substr(0,2);
                allCategorys.forEach(largecat => {
                    if(largecat['value']===lcode){
                        largecat['children'].forEach(middlecat => {
                            var mcode = scat['CODE'].substr(0,4);
                            if(middlecat['value']===mcode){
                                middlecat['children'].push({
                                    value:scat['CODE'],
                                    label:scat['CT_NM']
                                })
                            }
                        })
                    }
                })
            })
            resolve(allCategorys);
        }else{
            resolve(false);
        }
    })
});

const getCodes = (upperCode=null) => new Promise((resolve,reject)=>{
    let query;
    let params=[];
    if(upperCode){
        const length = upperCode.length;
        query =  'select * from nt_categorys where (length(`CODE`)=? and type=1 and stat<9 and `code` like ?) or `code` = ? and type=1 and stat<9;';
        params.push(length+2);
        params.push(upperCode+'%');
        params.push(upperCode);
    }else{
        query = 'select * from nt_categorys where length(`CODE`)=2 and type=1 and stat<9; ';
    }
    db.query(query,params, (err,data) => {
        if(err){
            resolve(false);
        }else{
            resolve(data);
        }
    });
})

const getInfoById = (code)  => new Promise((resolve,reject)=>{
    const query = 'select * from nt_categorys where code = ?';
    const params = [code];
    db.query(query,params, (err,data) => {
        if(err){
            resolve(false);
        }else{
            resolve(data);
        }
    });
});

module.exports = {
    ToDict:codesToDict,
    getCodes:getCodes,
    getInfoById:getInfoById
}