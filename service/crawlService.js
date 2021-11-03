const procGet = require("../controller/solr/proc.ctrl");
const getFileList = require("../controller/nas/fileList.ctrl").getImage;
const captionCtrl = require("../controller/els/caption.ctrl");

const crawlSearch = async (req,res) => {
    let statusCode = parseInt(req.params.statusCode);
    let result;
    switch(statusCode){
        case 0:
            result = await procGet.Search(req);
            break;
        case 2:
            result = await captionCtrl.Search(req);
            break;
    }
    if(result){
        res.send(result);
    }else{
        res.status(400).send();
    }
}

const crawlInsert = async (req,res) => {
    captionCtrl.Insert(req);
}

module.exports = {
    Search:crawlSearch,
    Insert:crawlInsert
};