const elsDB = require("../../models/els/index").elsDB;
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

const serviceInsert = async (req) => {
    const query = {
        index: 'politica_service',
        refresh:true,
        body: {
        }
    };
    await elsDB.index(query);
    //result 값 받아서 return 시켜주기.
}

module.exports = {
    Search:serviceSearch,
    Insert:serviceInsert
}