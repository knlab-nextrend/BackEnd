const elsDB = require("../../models/els/index").elsDB;
const {convertCrawlDocTo} = require("../../lib/libs");
const config = require("../../models/els/index").config;

const serviceSearch = (req) => new Promise(async (resolve,reject) =>{
    const size = req.query.listSize;
    const from = req.query.pageNo? ((req.query.pageNo-1)*size):0;
    const query = {
        from:from,
        size:size,
        index: 'politica_service',
        body: {
            query: {
            match_all: {}
            }
        }
    };

    const value = await elsDB.search(query);
    const result = {
        "dcCount":value.body.hits.total.value
    };
    const documents = [];
    value.body.hits.hits.forEach((document)=>{
        doc = convertCrawlDocTo(document._source,'els');
        documents.push(doc);
    });
    result["docs"]=documents;
    resolve(result);
});

const serviceStage = (req) => new Promise(async (resolve,reject) =>{
    let doc = req.body.docs;
    doc["stat"] = 2;
    doc["item_id"] = req.body.itemId;
    doc["is_crawled"] = true;
    doc["dc_cover"] = null;
    doc["dc_hit"] = null;
    doc["dc_dt_regi"] = "1970-01-01T00:00:00+00:00";
    doc["dc_country_pub"] = [];
    doc["dc_country"] = [];
    doc["dc_code"] = [];
    doc["dc_link"] = null;
    doc["dc_smry_kr"] = null;
    doc["dc_title_kr"] = null;
    doc["dc_cat"] = null;
    doc["dc_type"] = null;
    doc["dc_publisher"] = null;

    const query = {
        index: 'politica_service',
        refresh:true,
        body: doc
    };
    const result = await elsDB.index(query);
    if(result.statusCode==201){
        resolve(true);
    }else{
        resolve(false);
    }
    //result 값 받아서 return 시켜주기.
});

module.exports = {
    Search:serviceSearch,
    Stage:serviceStage
}