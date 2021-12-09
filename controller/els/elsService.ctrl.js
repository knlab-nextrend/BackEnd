const elsDB = require("../../models/els/index").elsDB;
const {convertCrawlDocTo} = require("../../lib/libs");
const config = require("../../models/els/index").config;
const nationCtrl = require("../nextrend/nation.ctrl");
const codeCtrl = require("../nextrend/subjectCode.ctrl");

const nullProcessing = (doc) => {
    const now = new Date();
    if(doc===undefined) doc = {};
    const keys = Object.keys(doc);
    doc["is_crawled"] = keys.includes("is_crawled")? doc.is_crawled : true;
    doc["dc_cover"] = keys.includes("dc_cover")? doc.dc_cover : [];
    doc["dc_file"] = keys.includes("dc_file")? doc.dc_file : null;
    doc["dc_lang"] = keys.includes("dc_lang")? doc.dc_lang : null;
    doc["dc_hit"] = keys.includes("dc_hit")? doc.dc_hit : 0;
    doc["dc_page"] = keys.includes("dc_page")? doc.dc_page : 0;
    doc["dc_dt_regi"] =  keys.includes("dc_dt_regi")? doc.dc_dt_regi : now.toISOString();
    doc["dc_country_pub"] = keys.includes("dc_country_pub")? doc.dc_country_pub : [];
    doc["dc_country"] = keys.includes("dc_country")? doc.dc_country : [];
    doc["dc_code"] = keys.includes("dc_code")? doc.dc_code : [];
    doc["dc_keyword"] = keys.includes("dc_keyword")? doc.dc_keyword :[];
    doc["dc_link"] = keys.includes("dc_link")? doc.dc_link : null;
    doc["dc_smry_kr"] = keys.includes("dc_smry_kr")? doc.dc_smry_kr : null;
    doc["dc_title_kr"] = keys.includes("dc_title_kr")? doc.dc_title_kr : null;
    doc["dc_title_or"] = keys.includes("dc_title_or")? doc.dc_title_or : null;
    doc["dc_url_loc"] = keys.includes("dc_url_loc")? doc.dc_url_loc : null;
    doc["item_id"] = keys.includes("item_id")? doc.item_id : null;
    doc["dc_cat"] = keys.includes("dc_cat")? doc.dc_cat : null;
    doc["dc_type"] = keys.includes("dc_type")? doc.dc_type : null;
    doc["dc_publisher"] = keys.includes("dc_publisher")? doc.dc_publisher : null;
    doc["dc_content"] = keys.includes("dc_content")? doc.dc_content : null;
    doc["dc_dt_collect"] =  keys.includes("dc_dt_collect")? doc.dc_dt_collect : "1970-01-01T00:00:00+00:00";
    if(keys.includes("dc_dt_write")){
        if(doc.dc_dt_write===''){
            doc["dc_dt_write"] = "1970-01-01T00:00:00+00:00";
        }
    }else{
        doc["dc_dt_write"] = "1970-01-01T00:00:00+00:00";
    }
    return doc;
}

const elsDetail = (itemId) => new Promise(async (resolve,reject)=>{
    const query = {
        index: 'politica_service',
        body: {
            query: {
                match : {
                    item_id:itemId
                }
            }
        }
    };
    const value = await elsDB.search(query);
    if(value.statusCode==200||value.statusCode==201){
        const document = value.body.hits.hits[0];
        const result={
            docs:convertCrawlDocTo(document._source,'els'),
            id:document._id
        }

        //국가 표시 조정 단계
        let countrys = [];
        if(result.docs["dc_country"].length!==0){
            for(let countryId of result.docs["dc_country"]){
                const countryInfo = await nationCtrl.getCountryById(countryId);
                countrys.push(countryInfo[0]);
            }
            result.docs["dc_country"]=countrys;
        }

        let countrysPub = [];
        if(result.docs["dc_country_pub"].length!==0){
            for(let countryId of result.docs["dc_country_pub"]){
                const countryInfo = await nationCtrl.getCountryById(countryId);
                countrysPub.push(countryInfo[0]);
            }
            result.docs["dc_country_pub"]=countrysPub;
        }


        //코드 표시 조정 단계
        let codes = [];
        if(result.docs["dc_code"].length!==0){
            for(let code of result.docs["dc_code"]){
                const codeInfo = await codeCtrl.getInfoById(code);
                codes.push(codeInfo[0]);
            }
            result.docs["dc_code"]=codes;
        }

        resolve(result);
    }else{
        resolve(false);
    }
});

const elsSearch = (size,from,stat) => new Promise(async (resolve,reject) =>{
    const query = {
        from:from,
        size:size,
        index: 'politica_service',
        body: {
            query: {
                match : {
                    stat:stat
                }
            }
        }
    };

    const value = await elsDB.search(query);
    const result = {
        "dcCount":value.body.hits.total.value
    };
    const documents = [];
    for(let document of value.body.hits.hits){
        doc = convertCrawlDocTo(document._source,'els');

        //국가 표시 조정 단계
        let countrys = [];
        if(doc["dc_country"].length!==0){
            for(let countryId of doc["dc_country"]){
                const countryInfo = await nationCtrl.getCountryById(countryId);
                countrys.push(countryInfo[0]);
            }
            doc["dc_country"]=countrys;
        }

        let countrysPub = [];
        if(doc["dc_country_pub"].length!==0){
            for(let countryId of doc["dc_country_pub"]){
                const countryInfo = await nationCtrl.getCountryById(countryId);
                countrysPub.push(countryInfo[0]);
            }
            doc["dc_country_pub"]=countrysPub;
        }

        //코드 표시 조정 단계
        let codes = [];
        if(doc["dc_code"].length!==0){
            for(let code of doc["dc_code"]){
                const codeInfo = await codeCtrl.getInfoById(code);
                codes.push(codeInfo[0]);
            }
            doc["dc_code"]=codes;
        }

        documents.push(doc);
        
    };
    result["docs"]=documents;
    resolve(result);
});

const elsIndex = (doc,stat,id=false) => new Promise(async (resolve,reject) =>{
    let body = nullProcessing(doc);
    
    body.stat=stat;
    let query = {
        index: 'politica_service',
        refresh:true,
        body: body
    };
    if(id){
        query["id"]=id;
    }
    const result = await elsDB.index(query);
    if(result.statusCode==200||result.statusCode==201){
        resolve(true);
    }else{
        resolve(false);
    }
});

const elsKeep = (itemId,stat) => new Promise(async (resolve,reject) =>{
    let doc = {
        "script": {
          "inline": "ctx._source.stat = "+stat,
          "lang": "painless"
        },
        "query": {
          "match": {
            "item_id":itemId
          }
        }
      };
    const query = {
        index: 'politica_service',
        refresh:true,
        body: doc
    };
    const result = await elsDB.updateByQuery(query);
    if(result.statusCode==200||result.statusCode==201){
        resolve(true);
    }else{
        resolve(false);
    }
});

module.exports = {
    Search:elsSearch,
    Index:elsIndex,
    Detail:elsDetail,
    Keep:elsKeep
}