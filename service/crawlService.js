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
                result = await solrCtrl.Keep(itemId);
                break;
            case 2:
            case 3:
                // 일단 직접 지정...
                result = await elsCtrl.Keep(itemId,3);
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
                result = await solrCtrl.Detail(itemId);
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
                result = await elsCtrl.Detail(itemId);
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
                const condition = req.query;
                result = await solrCtrl.Search(condition,stat=statusCode);
                break;
            case 2:
            case 3:
                const size = req.query.listSize;
                const from = req.query.pageNo? ((req.query.pageNo-1)*size):0;
                result = await elsCtrl.Search(size,from,stat=statusCode);
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
            case 2:
            case 3:
                result = await elsCtrl.Keep(itemId,9);
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
//Stage 의 경우, 내용 수정이 있기 때문에 Modify로 접근하는 것이 맞음.
const crawlStage = async (req,res) => {
    const itemId = req.params.itemId;
    if(itemId===undefined){
        res.status(400).send();
    }else{
        let statusCode = parseInt(req.body.statusCode);
        let result;
        if(req.body.docs){
            const doc = req.body.docs;
            switch(statusCode){
                case 0:
                case 1:
                    // 순전히 추가하는 경우
                    result = await elsCtrl.Index(doc,2);
                    if(result){
                        //db 한쪽만 죽어있을 경우를 상정해서 나중에 복구하는 코드 만들어 놓기.
                        await solrCtrl.Delete(itemId);
                        res.send();
                    }else{
                        res.status(400).send({message:"some trouble in staging"});
                    }
                    break;
                case 2:
                case 3:
                    const itemDetail = await elsCtrl.Detail(itemId);
                    result = await elsCtrl.Index(doc,4,itemDetail.id);
                    if(result){
                        res.send();
                    }else{
                        res.status(400).send({message:"some trouble in staging"});
                    }
                    break;
            }
        }else{
            res.status(400).send({message:"no document exists"});
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