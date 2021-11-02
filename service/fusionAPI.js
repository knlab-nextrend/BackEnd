const procGet = require("../controller/solr/proc.ctrl");
const captionCtrl = require("../controller/els/caption.ctrl");

const crawlSearch = async (req,res) => {
    let id = parseInt(req.params.id);
    switch(id){
        case 0:
            procGet.Search(req,res);
            break;
        case 1:
            captionCtrl.Search(req,res);
            break;
    }
}

const crawlInsert = async (req,res) => {
    captionCtrl.Insert(req,res);
}

module.exports = {
    Search:crawlSearch,
    Insert:crawlInsert
};