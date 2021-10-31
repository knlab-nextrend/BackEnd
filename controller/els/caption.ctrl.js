const elsDB = require("../../models/els/index");

const serviceSearch = async (req, res) => {
    let body = {};

    const value = await elsDB.search({
        index: 'politica_service',
        body: {
            query: {
            match_all: {}
            }
        }
    });

    let result = {
        "dcCount":value.body.hits.total.value
    };
    let documents = [];
    value.body.hits.hits.forEach((document)=>{
        documents.push(document._source);
    });

    result["docs"]=documents;
    res.send(result);
}

const serviceInsert = async (req,res) => {
    const value = await elsDB.post({
        index: 'politica_service',
        body: {
            query: {
                lang: 'painless',
                source: 'ctx._source.times++',
            }
        }
    })
    console.dir(value);
}

module.exports = {
    Search:serviceSearch,
    Insert:serviceInsert
}