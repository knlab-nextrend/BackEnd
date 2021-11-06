const procGet = require("../controller/solr/proc.ctrl");
const getFileList = require("../controller/nas/fileList.ctrl").getImage;
const elsCtrl = require("../controller/els/elsService.ctrl");

//router.put('/detail/:itemId',crawlSearch.Keep);
const crawlKeep = async (req,res) => {
    const itemId = parseInt(req.params.itemId);
    //안되면 params 시도 혹은 query 시도.
    if(itemId===undefined){
        res.status(400).send();
    }else{
        let statusCode = parseInt(req.body.statusCode);
        let result;
        switch(statusCode){
            case 0:
                result = await procGet.Keep(req);
                break;
        }
        if(result){
            res.send(result);
        }else{
            res.status(400).send();
        }
    }
}

//router.get('/detail/:itemId',crawlSearch.Detail);
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
                if(result.docs.length===1){
                    result.docs=result.docs[0];
                    result.docs["stat"]=0;
                }else{
                    res.status(400).send();
                }
                break;
        }
        if(result){
            res.send(result);
        }else{
            res.status(400).send();
        }
        
    }
}

//router.get('/list/:statusCode',crawlSearch.Search);
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
                result = await elsCtrl.Search(req);
                break;
        }
        if(result){
            result.docs.forEach((doc)=>{
                doc["stat"]=0;
            });
            res.send(result);
        }else{
            res.status(400).send();
        }
    }
}

//router.delete('/detail/:itemId',crawlSearch.Delete);
const crawlDelete = async(req,res)=>{
    const itemId = parseInt(req.params.itemId);
    //안되면 params 시도 혹은 query 시도.
    if(itemId===undefined){
        res.status(400).send();
    }else{
        let statusCode = parseInt(req.query.statusCode);
        let result;
        switch(statusCode){
            case 0:
                result = await procGet.Delete(req);
                break;
        }
        if(result){
            res.send(result);
        }else{
            res.status(400).send();
        }
    }
}

const crawlStage = async (req,res) => {
    await elsCtrl.Stage(req);
    res.status(400).send();
}

module.exports = {
    Search:crawlSearch,
    Detail:crawlDetail,
    Keep:crawlKeep,
    Delete:crawlDelete,
    Stage:crawlStage,
};