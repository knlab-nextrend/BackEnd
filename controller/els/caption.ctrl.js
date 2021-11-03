const elsDB = require("../../models/els/index");

const serviceSearch = async (req, res) => {
    let size = req.query.listSize;
    let from = req.query.pageNo? ((req.query.pageNo-1)*size):0;
    let query = {
        from:from,
        size:size,
        index: 'politica_service',
        body: {
            query: {
            match_all: {}
            }
        }
    };

    console.dir(query);
    const value = await elsDB.search(query);

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