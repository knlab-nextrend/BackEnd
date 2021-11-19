const solrCtrl = require("../controller/solr/solrService.ctrl");
const getFileList = require("../controller/nas/nasService.ctrl").getImage;
const elsCtrl = require("../controller/els/elsService.ctrl");
const nasCtrl = require("../controller/nas/nasService.ctrl");
const nationCtrl = require("../controller/nextrend/nation.ctrl");

const imageService = async (req,res) => {
    const path = req.query.path;
    const result = 
    console.log(result);
    res.send(200);
}

//router.put('/detail/:itemId',crawlSearch.Keep);
//단일 데이터 기준 
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
            case 4:
            case 5:
                result = await elsCtrl.Keep(itemId,5);
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
            case 4:
            case 5:
            case 6:
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
            case 4:
            case 5:
            case 6:
            case 7:
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
            case 4:
            case 5:
            case 6:
            case 7:
                //els 부터는 삭제가 아닌, status 9 로 부여한 후 관리.
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
    let itemDetail;
    if(itemId===undefined){
        res.status(400).send();
    }else{
        let statusCode = parseInt(req.body.statusCode);
        let result;
        if(req.body.docs){
            let doc = req.body.docs;
            doc["item_id"]=itemId;
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
                    itemDetail = await elsCtrl.Detail(itemId);
                    result = await elsCtrl.Index(doc,4,itemDetail.id);
                    if(result){
                        res.send();
                    }else{
                        res.status(400).send({message:"some trouble in staging"});
                    }
                    break;
                case 4:
                case 5:
                    itemDetail = await elsCtrl.Detail(itemId);
                    result = await elsCtrl.Index(doc,6,itemDetail.id);
                    if(result){
                        res.send();
                    }else{
                        res.status(400).send({message:"some trouble in staging"});
                    }
                    break;
                case 6:
                    itemDetail = await elsCtrl.Detail(itemId);
                    result = await elsCtrl.Index(doc,7,itemDetail.id);
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


/* 이하 스크리닝 전용 라우터 함수
Detail 에서는 els 에서만 작업되기에 solr인 스크리닝은 분리.
 */
const screenGet = async(req,res) => {
    //stat 0으로 부여, 기존 정의된 함수 방법을 따르기 위해서임.
    const condition = req.query;
    result = await solrCtrl.Search(condition,stat=0,restrict=true);
    if(result){
        res.send(result);
    }else{
        res.status(400).send({message:"got error during search screening data"})
    }
}

const screenStage = async(req,res) => {
    const stageList = req.body.list;
    if(stageList===undefined){
        res.status(400).send({message:"no given stage list"});
    }else{
        const errorList = [];
        stageList.forEach(async (itemId)=>{
            const doc = await solrCtrl.Detail(itemId);
            const result = await elsCtrl.Index(doc.docs,2);
            if(result){
                //정상적으로 추가했을 때 solr 에서는 삭제 수행.
                await solrCtrl.Delete(itemId);
            }else{
                errorList.push(itemId);
            }
        })
        if(errorList.length){
            res.status(400).send({message:"cannot stage above list",list:errorList});
        }else{
            res.send();
        }
    }
}

const screenDelete = async(req,res) => {
    const deleteList = req.query.list;
    if(deleteList===undefined){
        res.status(400).send({message:"no given delete list"});
    }else{
        const errorList = [];
        deleteList.forEach(async (itemId)=>{
            const result = await solrCtrl.Delete(itemId);
            if(result){
                //정상적인 값일 때, 아무것도 수행하지 않음.
            }else{
                errorList.push(itemId);
            }
        })
        if(errorList.length){
            res.status(400).send({message:"cannot delete above list",list:errorList});
        }else{
            res.send();
        }
    }
}

module.exports = {
    Search:crawlSearch,
    Detail:crawlDetail,
    Keep:crawlKeep,
    Delete:crawlDelete,
    Stage:crawlStage,
    screenGet:screenGet,
    screenStage:screenStage,
    screenDelete:screenDelete,
    image:imageService,
};