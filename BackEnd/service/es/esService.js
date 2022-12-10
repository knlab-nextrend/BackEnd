const esDB = require("../../models/es/index").esDB;
const config = require("../../models/es/index").config;
const libs = require("../../lib/libs");


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
        doc_content_category: 2,
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

        const reqCode= parseInt(reqQuery.statusCode);
        let stat = (reqCode===6||reqCode===7)? [6,7]:8
        const searchQuery = libs.reqToEsFilters(reqQuery, stat, must, should);

        let result = esSearch(searchQuery);
        return result;
    }
}

module.exports = {
    Search: esSearch,
    CustomSearch : esCustomSearch,
    Index: esIndex,
    Detail: esDetail,
    Keep: esKeep
}