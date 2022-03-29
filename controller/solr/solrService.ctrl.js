const { convertCrawlDocTo } = require("../../lib/libs");
const solrDB = require("../../models/solr/index").solrDB;

// 이건 안쓴다고 보면 됨.
const solrDelete = (itemId) => new Promise(async(resolve,reject)=>{
    const query = 'item_id:'+itemId;
    solrDB.deleteByQuery(query,function(err,obj){
        if(err){
            resolve(false);
        }else{
            solrDB.softCommit();
            resolve(true);
        }
    });
})

// keep 을 스크리닝 삭제로 치환...
const solrKeep = (itemId,stat=1) => new Promise(async (resolve,reject)=>{
    const itemDetail = await solrDetail(itemId,true);
    const id = itemDetail.id;
    const query = {
        'id': id,
        'stat':{'set':stat},
    };
    solrDB.add(query, function(err, obj) {
        if (err) {
            resolve(false);
        } else {
            solrDB.softCommit();
            resolve(true);
        }
      });
});

const solrDetail = (itemId) => new Promise(async (resolve,reject)=> {
    let query = 'q=thumbnail:[* TO *] AND item_id:'+itemId;
    query = encodeURI(query);
    solrDB.search(query, async function(err, obj){
        if(err){
            resolve(false);
        }else{
            obj.response.id = obj.response.docs[0]['id'];
            obj.response.docs = convertCrawlDocTo(obj.response.docs[0],'solr');
            obj.response.dcCount = obj.response.numFound;
            delete obj.response.numFound;
            resolve(obj.response);
        }
    });
});

const solrSearch = (condition,stat,restrict=false) => new Promise(async (resolve,reject)=>{
    let query = "thumbnail:[* TO *]";
    let paramsDict = {
        // 상세 params
        "keyword": condition.keyword,
        "lang": condition.lang,
        "subscribed": condition.subscribed,
        "itemId": condition.itemId,
        "fromDate":condition.dateLte,
        "toDate":condition.dateGte,
        "pageGte":condition.pageGte||'*',
        "pageLte":condition.pageLte||'*',
        "host":condition.host,
        "sort":condition.sort||'desc',

        //기본 params
        "pageNo":condition.pageNo,
        "listSize": condition.listSize
    }

    //null check and solr query 형태로 변환
    //키워드 없을 시 contents 컬럼 전체
    query=query+' AND pages:['+paramsDict["pageGte"]+' TO '+paramsDict["pageLte"]+']';
    
    if(paramsDict["host"]!==undefined){
        query=query+' AND host:'+paramsDict["host"];
    }

    if(paramsDict["keyword"]===undefined){
        query=query+' AND contents:*';
    }else{
        query=query+' AND contents:'+paramsDict["keyword"];
    }
    //item_id 설정..
    if(paramsDict["itemId"]!==undefined){
        query=query+' AND item_id:'+paramsDict["itemId"];
    }

    //stat이 0일 경우, 1과 2가 아닌 대상을 조회함.
    query=query+' AND stat:'+stat;

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

    if((paramsDict["toDate"]==undefined)&&(paramsDict["fromDate"]==undefined)){
    }else{
        query=query+' AND lastmodified:['+toDate+' TO '+fromDate+']';
    }
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
    // if(paramsDict["pageNo"]!==undefined){
    //     let documentIndex = (parseInt(paramsDict["pageNo"])-1)*paramsDict["listSize"];
    //     query=query+'&start='+documentIndex.toString();
    // }
    // query=query+'&rows='+paramsDict["listSize"];
    let start;
    if(paramsDict["pageNo"]!==undefined){
        const documentIndex = (parseInt(paramsDict["pageNo"])-1)*paramsDict["listSize"];
        start = documentIndex.toString();
    }else{
        start = 0;
    }

    let solrQuery = solrDB.createQuery().q(query).start(start).rows(paramsDict["listSize"]).sort({lastmodified:paramsDict["sort"]});
    //query=query+'&sort=creationdate '+paramsDict["sort"];
    // 띄어쓰기--> %20
    // solrDB.search(query, function(err, obj){
    solrDB.search(solrQuery, function(err, obj){
        if(err){
            resolve(false);
        }else{
            const newDocs = [];
            obj.response.dcCount = obj.response.numFound;
            obj.response.docs.forEach((document)=>{
                newDocs.push(convertCrawlDocTo(document,'solr',restrict));
            })
            delete obj.response.numFound;
            obj.response.docs=newDocs;
            resolve(obj.response);
        }
    });
})

module.exports = {
    Search:solrSearch,
    Detail:solrDetail,
    Keep:solrKeep,
    Delete:solrDelete
};


