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
<<<<<<< HEAD
=======

>>>>>>> 4eb73263aa397f263d894e5d2b35198f54b3df69
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
<<<<<<< HEAD

    body.status = stat;
=======
    body.status = stat;

>>>>>>> 4eb73263aa397f263d894e5d2b35198f54b3df69
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
<<<<<<< HEAD
        resolve(true);
=======
        resolve(result._id);
>>>>>>> 4eb73263aa397f263d894e5d2b35198f54b3df69
    } else if (ret) {
        resolve(result._id);
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

module.exports = {
    Search: esSearch,
    Index: esIndex,
    Detail: esDetail,
    Keep: esKeep
}