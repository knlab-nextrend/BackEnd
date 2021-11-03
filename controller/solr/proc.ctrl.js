const solrDB = require("../../models/solr/index");

const procDetail = (req) => new Promise(async (resolve,reject)=> {
    const query = 'q=item_id:'+;
});

const procSearch = (req) => new Promise(async (resolve,reject)=>{
    let query = 'q=';
    let paramsDict = {
        // 상세 params
        "keyword": req.query.keyword,
        "lang": req.query.lang,
        "subscribed": req.query.subscribed,
        "itemId": req.query.itemId,
        "fromDate":req.query.fromDate,
        "toDate":req.query.toDate,

        //기본 params
        "pageNo":req.query.pageNo,   
        "listSize": req.query.listSize
    }

    //null check and solr query 형태로 변환
    //키워드 없을 시 contents 컬럼 전체
    if(paramsDict["keyword"]===undefined){
        query=query+'contents:*';
    }else{
        query=query+'contents:'+paramsDict["keyword"];
    }
    //item_id 설정..
    if(paramsDict["itemId"]!==undefined){
        query=query+' AND item_id:'+paramsDict["itemId"];
    }
    //Date 설정.
    let fromDate;
    let toDate;
    if(paramsDict["fromDate"]==undefined){
        fromDate = 'NOW';
    }else{
        fromDate = new Date(paramsDict["fromDate"]);
        fromDate = fromDate.toISOString();
    }
    if(paramsDict["toDate"]==undefined){
        toDate='*';
    }else{
        toDate = new Date(paramsDict["toDate"]);
        toDate = toDate.toISOString();
    }
    query=query+' AND updated_at:['+toDate+' TO '+fromDate+']';
    //keyword, date는 쿼리에 항상 들어감.

    if(paramsDict["lang"]!==undefined){
        query=query+' AND language:'+paramsDict["lang"];
    }

    /* subscribed 사용 하기 위해선 db 협의 필요
    if(paramsDict["subscribed"]!==undefined){
        query=query+' AND subscribed:'+paramsDict["subscribed"];
    }
    */

    //pagination 기능 param은 항상 뒤에 붙음.
    if(paramsDict["pageNo"]!==undefined){
        let documentIndex = (parseInt(paramsDict["pageNo"])-1)*paramsDict["listSize"];
        query=query+'&start='+documentIndex.toString();
    }
    query=query+'&rows='+paramsDict["listSize"];
    
    // 띄어쓰기--> %20
    query = encodeURI(query);
    await solrDB.search(query, function(err, obj){
        if(err){
            reject();
        }else{
            obj.response.dcCount = obj.response.numFound;
            delete obj.response.numFound;
            resolve(obj.response);
        }
    });
})

module.exports = {
    Search:procSearch,
    Detail:procDetail
};


