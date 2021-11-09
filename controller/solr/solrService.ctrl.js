const { convertCrawlDocTo } = require("../../lib/libs");
const solrDB = require("../../models/solr/index").solrDB;

const solrDelete = (req) => new Promise(async(resolve,reject)=>{
    const query = 'item_id:'+req.params.itemId;
    solrDB.deleteByQuery(query,function(err,obj){
        if(err){
            resolve(false);
        }else{
            solrDB.softCommit();
            resolve(true);
        }
    });
})

const solrKeep = (req) => new Promise(async (resolve,reject)=>{
    const itemDetail = await solrDetail(req,true);
    const id = itemDetail.docs["id"];

    const query = {
        'id': id,
        'stat':{'set':1},
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

const solrDetail = (req,returnId=false) => new Promise((resolve,reject)=> {
    let query = 'q=item_id:'+req.params.itemId;
    query = encodeURI(query);
    solrDB.search(query, function(err, obj){
        if(err){
            resolve(false);
        }else{
            obj.response.docs = convertCrawlDocTo(obj.response.docs[0],'solr')
            obj.response.dcCount = obj.response.numFound;
            delete obj.response.numFound;
            resolve(obj.response);
        }
    });
});

const solrSearch = (req,stat) => new Promise(async (resolve,reject)=>{
    let query = "q=";
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

    //stat이 0일 경우, 1이 아닌 대상을 조회함.
    if(stat===1){
        query=query+' AND stat:'+stat;
    }else{
        query=query+' AND !stat:1';
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
    solrDB.search(query, function(err, obj){
        if(err){
            resolve(false);
        }else{
            const newDocs = [];
            obj.response.dcCount = obj.response.numFound;
            obj.response.docs.forEach((document)=>{
                newDocs.push(convertCrawlDocTo(document,'solr'));
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


