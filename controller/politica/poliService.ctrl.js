const db = require("../../models/politica/index");

const checkStat = (itemId)=> new Promise((resolve, reject) => {
    const param = [itemId];
    const query = "select * from collected_item where item_id=?";
    db.query(query, param,(err, data) => {
        if (err) {
            resolve(false);
        } else {
            if(data.length==0){
                resolve(false);
            }else{
                resolve(true);
            }
        }
    })
})

const modSubmitStat = (itemId) => new Promise((resolve, reject) => {
    const date = new Date().toISOString().split('T')[0];
    const param = [date,itemId];
    const query = "update collected_item set submit_status=1, submint_time=? where item_id=?";
    db.query(query, param,(err, data) => {
        if (err) {
            resolve(false);
        } else {
            resolve(data);
        }
    })
})

module.exports = {
    modSubmitStat:modSubmitStat,
    checkStat:checkStat
}