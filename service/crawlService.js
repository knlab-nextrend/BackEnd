const solrCtrl = require("../controller/solr/solrService.ctrl");
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
            case 1:
                result = await solrCtrl.Keep(req);
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
        res.status(400).send({message:"no item_id"}); 
    }else{
        let statusCode = parseInt(req.query.statusCode);
        let result;
        switch(statusCode){
            case 0:
            case 1:
                result = await solrCtrl.Detail(req);
                if(typeof result.docs==='object'){
                    if(result.docs["stat"]===undefined){
                        result.docs["stat"]=0;
                    }
                }else{
                    res.status(400).send({message:"multiple documents exists"});
                }
                break;
            case 2:
            case 3:
                result = await elsCtrl.Detail(req);
                break;
        }
        if(result){
            res.send(result);
        }else{
            res.status(400).send({message:"no result"});
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
            case 1:
                result = await solrCtrl.Search(req,stat=statusCode);
                break;
            case 2:
                result = await elsCtrl.Search(req);
                break;
        }
        if(result){
            result.docs.forEach((doc)=>{
                if(doc["stat"]===undefined){
                    doc["stat"]=0;
                }
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
    if(itemId===undefined){
        res.status(400).send();
    }else{
        let statusCode = parseInt(req.query.statusCode);
        let result;
        switch(statusCode){
            case 0:
            case 1:
                result = await solrCtrl.Delete(req);
                break;
        }
        if(result){
            res.send(result);
        }else{
            res.status(400).send();
        }
    }
}

//router.post('/detail/:itemId',authJWT,crawlService.Stage);
const crawlStage = async (req,res) => {
    const itemId = req.params.itemId;
    if(itemId===undefined){
        res.status(400).send();
    }else{
        let statusCode = parseInt(req.body.statusCode);
        let result;
        switch(statusCode){
            case 0:
            case 1:
                result = await elsCtrl.Stage(req);
                break;
        }
        if(result){
            //db 한쪽만 죽어있을 경우를 상정해서 나중에 복구하는 코드 만들어 놓기.
            await solrCtrl.Delete(req);
            res.status(200).send();
        }else{
            res.status(400).send();
        }
    }
}

module.exports = {
    Search:crawlSearch,
    Detail:crawlDetail,
    Keep:crawlKeep,
    Delete:crawlDelete,
    Stage:crawlStage,
};