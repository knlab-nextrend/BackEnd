const solrDB = require("../../models/solr/index");

const query = 'q=*:*';
const docsSearch = (req,res) => {
    solrDB.search(query, function(err, obj){
        if(err){
            console.log(err);
        }else{
            res.send(obj);
        }
    });
}

module.exports = {
    Search:docsSearch
};


