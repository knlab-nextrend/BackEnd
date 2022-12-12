const esDB = require("../../models/es/index").esDB;
const config = require("../../models/es/index").config;
const libs = require("../../lib/libs");
const _ = require('lodash');

const esDetail = (_id) => new Promise(async (resolve, reject) => {
    const query = {
        index: 'politica_service',
        body: {
            query: {
                match: {
                    _id: _id
                }
            }
        }
    };
    try {
        const value = await esDB.search(query);
        resolve(value);
    } catch (e) {
        reject(e);
    }
});

const esSearch = (searchQuery) => new Promise(async (resolve, reject) => {

    try{
        const value = await esDB.search(searchQuery);
        const result = {
            "dcCount": value.body.hits.total.value
        };
        const documents = [];
        for (let document of value.body.hits.hits) {
            doc = document._source;
            doc["_id"] = document._id;
            documents.push(doc);
        };
        result["docs"] = documents;
        resolve(result);
    }catch(e){
        console.log(e);
        reject(e);
    }
});

const esIndex = (doc, stat, id = false, ret = false) => new Promise(async (resolve, reject) => {
    let body = libs.nullProcessing(doc);
    body.status = stat;

    let query = {
        index: 'politica_service',
        refresh: true,
        body: body
    };
    if (id) {
        query["id"] = id;
    }
    const result = await esDB.index(query);

    if (result.statusCode == 200 || result.statusCode == 201) {
        resolve(result.body._id);
    } else if (ret) {
        resolve(result.body._id);
    } else {
        resolve(false);
    }
});

const esKeep = (_id, stat) => new Promise(async (resolve, reject) => {
    let doc = {
        "script": {
            "inline": "ctx._source.status = " + stat,
            "lang": "painless"
        },
        "query": {
            "match": {
                "_id": _id
            }
        }
    };
    const query = {
        index: 'politica_service',
        refresh: true,
        body: doc
    };
    const result = await esDB.updateByQuery(query);
    if (result.statusCode == 200 || result.statusCode == 201) {
        resolve(true);
    } else {
        resolve(false);
    }
});


// axis는 {"3" : 10, "6" :1010} 이렇게 넘어와야함.
//stat은 문서의 stat
const esCustomSearch = async (reqQuery, axis)=>{
    const fieldList = {
        doc_country: 3,
        doc_publish_country: 3,
        doc_category: 1,
        doc_language: 4,
        doc_content_type: 2,
        doc_custom: 6,
        doc_topic: 5,
    };

    let should = [];
    let must = [];
    for (const [type, value] of Object.entries(axis)) {
        // 코드에 해당하는 필드들을 조회
        const keys = Object.keys(fieldList).filter(key => fieldList[key] === parseInt(type));
        if(keys.length>1){
            keys.forEach((field) => {
                let tempDict = {};
                tempDict[field] = value + '.*';
                should.push({regexp:tempDict});
            })
        }else{
            let tempDict = {};
            tempDict[keys[0]] = value + '.*';
            must.push({regexp:tempDict});
        }

    }

    const reqCode= parseInt(reqQuery.statusCode);
    let stat = (reqCode===6||reqCode===7)? [6,7]:8
    const searchQuery = libs.reqToEsFilters(reqQuery, stat, must, should);

    
    
    searchQuery.from = 0;
    searchQuery.size = 5000;

    let result = await esSearch(searchQuery);

    return result;
}

const parseResult = async (searchResult, query)=>{

    // docs 중복 제거
    searchResult.docs = _.uniqBy(searchResult.docs, "_id");

    const result = {dcCount : 0, docs : []};

    searchResult.dcCount = searchResult.docs.length;
    result.dcCount = searchResult.dcCount;

    const size = query.listSize||10;
    const from = query.pageNo ? ((query.pageNo - 1) * size) : 0;
    const sortType = query.sortType||'doc_collect_date';
    let orderType = (query.sort||'desc') == "desc" ? -1 : 1;


    // 정렬기준에 맞게 정렬한다.
    searchResult.docs.sort((a, b)=>{
        if(a[sortType] > b[sortType]) return 1 * orderType;
        if(a === b) return 0;
        if(a < b) return -1 * orderType;
    })


    let cnt = 0;

    //그 후 listSize 만큼의 document를 넣는다.
    for(let i = from; i <searchResult.dcCount; i++, cnt++){
        if(cnt >= size) break;
        result.docs.push(searchResult.docs[i]);
    }

    return result;
}

module.exports = {
    Search: esSearch,
    CustomSearch : esCustomSearch,
    Index: esIndex,
    Detail: esDetail,
    Keep: esKeep,
    parseResult : parseResult
}