const procGet = require("../controller/solr/proc.ctrl");
const getFileList = require("../controller/nas/fileList.ctrl").getImage;
const elsCtrl = require("../controller/els/elsService.ctrl");

const crawlDetail = async (req,res) => {
    const itemId = parseInt(req.params.itemId);
    if(itemId===undefined){
        res.status(400).send();
    }else{
        let statusCode = parseInt(req.query.statusCode);
        let result;
        switch(statusCode){
            case 0:
                result = await procGet.Detail(req);
                break;
        }
        res.send(result);
    }
    

}

const crawlSearch = async (req,res) => {
    const statusCode = parseInt(req.params.statusCode);
    if(statusCode===undefined){
        res.status(400).send();
    }else{
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
}

const crawlInsert = async (req,res) => {
    elsCtrl.Insert(req);
}

module.exports = {
    Search:crawlSearch,
    Insert:crawlInsert,
    Detail:crawlDetail
};