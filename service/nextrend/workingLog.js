const db = require("../../models/nextrend/index");

/*
workType
1: 조회, 2: 이관, 3: 수정, 4: 보류, 5: 삭제
*/
const addEditLog = (wid, esId, docStat, workType,host=null ) => new Promise((resolve,reject)=>{
    const query = 'insert into nt_edit_log (wid, es_id, doc_stat, work_type,host) values (?,?,?,?,?);'
    const params = [wid,esId,docStat,workType,host];
    db.query(query, params, (err,data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

const addScreeningLog = (wid, docStat, workType, quantity )=> new Promise((resolve,reject)=>{
    const query = 'insert into nt_screen_log (wid, doc_stat, work_type, quantity) values (?,?,?,?);'
    const params = [wid,docStat,workType,quantity];
    db.query(query, params, (err,data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

// 큐레이션의 경우 동작은.. 수정과 이관이 있을 것임. 하지만 정량 체크가 우선이기에 관련 정보는 nt_edit_log에서 관리.
const addCurationLog = (wid, esId, quality, bef,cur)=> new Promise((resolve,reject)=>{
    const query = 'insert into nt_curation_log (wid, es_id, quality, content_bef,content_cur) values (?,?,?,?,?);'
    const params = [wid,esId,quality,bef,cur];
    db.query(query, params, (err,data) => {
        if(err){
            reject(err);
        }else{
            resolve(data);
        }
    });
})

const getDailyLog = (wid,dateGte,dateLte,workType,docStat=null,screening=false) => new Promise((resolve,reject)=>{
    let where;
    let params;
    if(wid){
        wid = 'c.wid='+wid+' and '
    }else{ 
        wid = ''
    }
    if(screening){
        where = ', ifnull(sum(b.quantity),0) as cnt from nt_date a left join (select * from nt_screen_log c where '+wid+'WORK_TYPE=? ) b'
        params = [workType];
    }else{
        where = ', count(b.idx) as cnt from nt_date a left join (select * from nt_edit_log c where '+wid+'WORK_TYPE=? and DOC_STAT in '+docStat+') b';
        params = [workType];
    }
    let query = "select DATE_FORMAT(a.`date`, '%Y-%m-%d') as start,null as end,null as `date` "+where+" on date_format(a.date,'%Y-%m-%d')=date_format(b.dt,'%Y-%m-%d') where a.date>='"+dateGte+"' and a.date<='"+dateLte+"' group by start;"
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
})

const getWeeklyLog = (wid,dateGte,dateLte,workType,docStat=null,screening=false) => new Promise((resolve,reject)=>{
    let where;
    let params;
    if(wid){
        wid = 'c.wid='+wid+' and '
    }else{ 
        wid = ''
    }
    if(screening){
        where = ', ifnull(sum(b.quantity),0) as cnt from nt_date a left join (select * from nt_screen_log c where '+wid+'WORK_TYPE=? ) b'
        params = [workType];
    }else{
        where = ', count(b.idx) as cnt from nt_date a left join (select * from nt_edit_log c where '+wid+'WORK_TYPE=? and DOC_STAT in '+docStat+') b';
        params = [workType];
    }
    let query = "select DATE_FORMAT(DATE_SUB(a.`date`, INTERVAL (DAYOFWEEK(a.`date`)-1) DAY), '%Y-%m-%d') as start, DATE_FORMAT(DATE_SUB(a.`date`, INTERVAL (DAYOFWEEK(a.`date`)-7) DAY), '%Y-%m-%d') as end, DATE_FORMAT(a.`date`, '%u')+1 AS `date` "+where+" on date_format(a.date,'%Y-%m-%d')=date_format(b.dt,'%Y-%m-%d') where a.date>='"+dateGte+"' and a.date<='"+dateLte+"' group by start;"
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
})

const getMonthlyLog = (wid,dateGte,dateLte,workType,docStat=null,screening=false) => new Promise((resolve,reject)=>{
    let where;
    let params;
    if(wid){
        wid = 'c.wid='+wid+' and '
    }else{ 
        wid = ''
    }
    if(screening){
        where = ', ifnull(sum(b.quantity),0) as cnt from nt_date a left join (select * from nt_screen_log c where '+wid+'WORK_TYPE=? ) b'
        params = [workType];
    }else{
        where = ', count(b.idx) as cnt from nt_date a left join (select * from nt_edit_log c where '+wid+'WORK_TYPE=? and DOC_STAT in '+docStat+') b';
        params = [workType];
    }
    let query = "select DATE_FORMAT(DATE_SUB(a.`date`, INTERVAL (dayofmonth(a.`date`)-1) DAY), '%Y-%m-%d') as start, last_day(a.`date`) as end, month(a.`date`) as `date` "+where+" on date_format(a.date,'%Y-%m-%d')=date_format(b.dt,'%Y-%m-%d') where a.date>='"+dateGte+"' and a.date<='"+dateLte+"' group by start;"
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
})

const getCurationLog = (wid,dateGte,dateLte) => new Promise((resolve,reject)=>{
    const query = 'select * from nt_curation_log where wid = ? and dt>="'+dateGte+'" and dt<="'+dateLte+'"';
    const params = [wid];
    db.query(query,params,(err,data)=>{
        if(err){
            reject(err)
        }else{
            resolve(data);
        }
    });
})

const getAllLog = () => new Promise((resolve,reject)=>{
    const q1 = 'select ifnull(sum(QUANTITY),0) as screening from nt_screen_log where WORK_TYPE=2 and DOC_STAT=2;';
    const q2 = 'select count(*) as register from nt_edit_log where WORK_TYPE=2 and DOC_STAT in (2,3);'
    const q3 = 'select count(*) as archive from nt_edit_log where WORK_TYPE=2 and DOC_STAT in (4,5);'
    const q4 = 'select count(*) as curation from nt_edit_log where WORK_TYPE=2 and DOC_STAT in (6,7);'
    
    let result = {};
    db.query(q1+q2+q3+q4,(err,data)=>{
        if(err){
            reject(err)
        }else{
            data.forEach(row => {
                const key = Object.keys(row[0]);
                const value = Object.values(row[0]);
                result[key] = value[0];
            });
            resolve(result);
        }
    });
})

module.exports = {
    addEditLog : addEditLog,
    addScreeningLog : addScreeningLog,
    addCurationLog : addCurationLog,
    getDailyLog:getDailyLog,
    getWeeklyLog:getWeeklyLog,
    getMonthlyLog:getMonthlyLog,
    getCurationLog:getCurationLog,
    getAllLog:getAllLog
}

