const solrCtrl = require("../controller/solr/solrService.ctrl");
const elsCtrl = require("../controller/els/elsService.ctrl");
const nasCtrl = require("../controller/nas/nasService.ctrl");
const poliCtrl = require("../controller/politica/poliService.ctrl");
const fileCtrl = require("../controller/nextrend/files.ctrl");
const path = require("path");

/*
Document Status Code list
*/

const test = async (req, res) => {
    const imgUrl = await poliCtrl.checkStat();
    res.status(200).send(imgUrl);
}

const docImage = async (req, res) => {
    if (req.file) {
        try {
            const result = await elsCtrl.Detail(req.body.itemId);

            if (result) {
                const splited = result.docs.dc_cover[0].split(/(?=\/)/g);
                const serverIP = splited[0];
                const nasCoverPath = splited.slice(1, -1).join('');
                const contentPath = nasCoverPath + '/contentImage/';
                const existError = await nasCtrl.checkFolderExist(contentPath,type='image');

                if (existError) { 
                    // contentImage 폴더 미존재
                    if (existError.code === 550) {
                        // no directory로 인한 오류일 경우 생성
                        const makeError = await nasCtrl.makeFolder(contentPath,type='image');
                        if (makeError) { 
                            // 폴더를 만드는데 오류가 있을 경우 throw
                            throw 'error occured during make folder';
                        }
                    } else { 
                        // no directory 외의 다른 오류일 경우 throw
                        throw 'error occured during access to nas';
                    }
                }

                // 이 시점에서는 폴더가 만들어져 있음. 업로드 진행.
                const uploadError = await nasCtrl.uploadFile(req.file,contentPath,type='image');
                console.log(uploadError);
                if(uploadError){
                    // 업로드 실패시 throw
                    console.log('test');
                    throw 'error occured put file to nas storage';
                }else{
                    // 모든 작업 수행 성공 시 fileRoute를 반환.
                    const fileRoute = path.join(serverIP,contentPath,req.file.filename);
                    await fileCtrl.unlinkFile(req.file.path);
                    res.send(fileRoute);
                }
            } else {
                throw 'not given itemid';
            }
        } catch (e) {
            console.log('clear');
            // exception으로 인한 에러 시, 직접 file을 unlink 해줌. 에러 메세지를 그대로 전달.
            await fileCtrl.unlinkFile(req.file.path);
            res.status(400).send({message:e});
        }
    } else {
        res.status(400).send({message:'file not attached'});
    }
}

//router.put('/detail/:itemId',crawlSearch.Keep);
//단일 데이터 기준 
const crawlKeep = async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    //안되면 params 시도 혹은 query 시도.
    if (itemId === undefined) {
        res.status(400).send();
    } else {
        let statusCode = parseInt(req.body.statusCode);
        let result;
        switch (statusCode) {
            case 0:
            case 1:
                result = await solrCtrl.Keep(itemId);
                break;
            case 2:
            case 3:
                // 일단 직접 지정...
                result = await elsCtrl.Keep(itemId, 3);
                break;
            case 4:
            case 5:
                result = await elsCtrl.Keep(itemId, 5);
                break;
        }
        if (result) {
            res.send(result);
        } else {
            res.status(400).send();
        }
    }
}

//router.get('/detail/:itemId',crawlSearch.Detail);
const crawlDetail = async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    if (itemId === undefined) {
        res.status(400).send({ message: "no item_id" });
    } else {
        let statusCode = parseInt(req.query.statusCode);
        let result;
        switch (statusCode) {
            case 0:
            case 1:
                result = await solrCtrl.Detail(itemId);
                if (typeof result.docs === 'object') {
                    if (result.docs["stat"] === undefined) {
                        result.docs["stat"] = 0;
                    }
                } else {
                    res.status(400).send({ message: "multiple documents exists" });
                }
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                result = await elsCtrl.Detail(itemId);
                break;
        }
        if (result) {
            res.send(result);
        } else {
            res.status(400).send({ message: "no result" });
        }
    }
}

//router.get('/list/:statusCode',crawlSearch.Search);
const crawlSearch = async (req, res) => {
    const statusCode = parseInt(req.params.statusCode);
    if (statusCode === undefined) {
        res.status(400).send();
    } else {
        let result;
        switch (statusCode) {
            case 0:
            case 1:
                const condition = req.query;
                result = await solrCtrl.Search(condition, stat = statusCode);
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                let conditions = {
                    dc_lang: req.query.dc_lang || '',
                    dc_code: req.query.dc_code || '',
                    dc_keyword: req.query.dc_keyword || '',
                    dc_country: req.query.dc_country || '',
                    dc_publisher: req.query.dc_publisher || '',
                    dateType: req.query.dateType || 'dc_dt_collect',
                    gte: req.query.gte || '*',
                    lte: req.query.lte || '*',
                    is_crawled: req.query.is_crawled || '',
                    sort: req.query.sort || 'desc',
                    sortType: req.query.sortType || 'dc_dt_collect'
                };

                const size = req.query.listSize;
                const from = req.query.pageNo ? ((req.query.pageNo - 1) * size) : 0;
                result = await elsCtrl.Search(size, from, stat = statusCode, conditions = conditions);
                break;
        }
        if (result) {
            result.docs.forEach((doc) => {
                if (doc["stat"] === undefined) {
                    doc["stat"] = 0;
                }
            });
            res.send(result);
        } else {
            res.status(400).send();
        }
    }
}

//router.delete('/detail/:itemId',crawlSearch.Delete);
const crawlDelete = async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    if (itemId === undefined) {
        res.status(400).send();
    } else {
        let statusCode = parseInt(req.query.statusCode);
        let result;
        switch (statusCode) {
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
                result = await elsCtrl.Keep(itemId, 9);
                break;
        }
        if (result) {
            res.send(result);
        } else {
            res.status(400).send();
        }
    }
}

//router.post('/detail/:itemId',authJWT,crawlService.Stage);
//Stage 의 경우, 내용 수정이 있기 때문에 Modify로 접근하는 것이 맞음.
const crawlStage = async (req, res) => {
    const itemId = req.params.itemId;
    let itemDetail;
    if (itemId === undefined) {
        res.status(400).send();
    } else {
        let statusCode = parseInt(req.body.statusCode);
        let result;
        if (req.body.docs) {
            let doc = req.body.docs;
            doc["item_id"] = itemId;
            switch (statusCode) {
                case 0:
                case 1:
                    // 순전히 추가하는 경우
                    result = await elsCtrl.Index(doc, 2);
                    if (result) {
                        //delete 에서 keep 으로 삭제는 이루어지지 않음. (stat=1로 부여함으로써 삭제 조치..)
                        await solrCtrl.Keep(itemId, 2);
                        res.send();
                    } else {
                        res.status(400).send({ message: "some trouble in staging" });
                    }
                    break;
                case 2:
                case 3:
                    itemDetail = await elsCtrl.Detail(itemId);
                    result = await elsCtrl.Index(doc, 4, itemDetail.id);
                    if (result) {
                        res.send();
                    } else {
                        res.status(400).send({ message: "some trouble in staging" });
                    }
                    break;
                case 4:
                case 5:
                    itemDetail = await elsCtrl.Detail(itemId);
                    result = await elsCtrl.Index(doc, 6, itemDetail.id);
                    if (result) {
                        res.send();
                    } else {
                        res.status(400).send({ message: "some trouble in staging" });
                    }
                    break;
                case 6:
                    const checked = await poliCtrl.checkStat(itemId);
                    if (checked) {
                        itemDetail = await elsCtrl.Detail(itemId);
                        result = await elsCtrl.Index(doc, 7, itemDetail.id);
                        if (result) {
                            await poliCtrl.modSubmitStat(itemId);
                            res.send();
                        } else {
                            res.status(400).send({ message: "els error" });
                        }
                        res.send();
                    } else {
                        res.status(400).send({ message: "poli error" });
                    }
                    break;
                case 7:
                    itemDetail = await elsCtrl.Detail(itemId);
                    result = await elsCtrl.Index(doc, 7, itemDetail.id);
                    if (result) {
                        res.send();
                    } else {
                        res.status(400).send({ message: "some trouble in staging" });
                    }
                    break;
            }
        } else {
            res.status(400).send({ message: "no document exists" });
        }

    }
}


/* 이하 스크리닝 전용 라우터 함수
Detail 에서는 els 에서만 작업되기에 solr인 스크리닝은 분리.
 */
const screenGet = async (req, res) => {
    //stat 0으로 부여, 기존 정의된 함수 방법을 따르기 위해서임.
    const condition = req.query;
    result = await solrCtrl.Search(condition, stat = 0, restrict = true);
    if (result) {
        res.send(result);
    } else {
        res.status(400).send({ message: "got error during search screening data" })
    }
}

const screenStage = async (req, res) => {
    const stageList = req.body.list;
    if (stageList === undefined) {
        res.status(400).send({ message: "no given stage list" });
    } else {
        const errorList = [];
        stageList.forEach(async (itemId) => {
            const doc = await solrCtrl.Detail(itemId);
            //스크리닝으로부터 넘어오는 단계임. 이때 이미지 url 을 만들어 저장.
            doc.docs.dc_cover = await nasCtrl.getImage(doc.docs.dc_cover);

            const result = await elsCtrl.Index(doc.docs, 2);
            if (result) {
                //정상적으로 추가했을 때 solr 에서는 삭제 수행. (keep으로 stat=1 부여)
                await solrCtrl.Keep(itemId);
            } else {
                errorList.push(itemId);
            }
        })
        if (errorList.length) {
            res.status(400).send({ message: "cannot stage above list", list: errorList });
        } else {
            res.send();
        }
    }
}

const screenDelete = async (req, res) => {
    const deleteList = req.query.list;
    if (deleteList === undefined) {
        res.status(400).send({ message: "no given delete list" });
    } else {
        const errorList = [];
        deleteList.forEach(async (itemId) => {
            //stat 2 부여함으로써 일단 추후 처리 도모... 기능상 이유는 없음.
            const result = await solrCtrl.Keep(itemId, 2);
            if (result) {
                //정상적인 값일 때, 아무것도 수행하지 않음.
            } else {
                errorList.push(itemId);
            }
        })
        if (errorList.length) {
            res.status(400).send({ message: "cannot delete above list", list: errorList });
        } else {
            res.send();
        }
    }
}

module.exports = {
    Search: crawlSearch,
    Detail: crawlDetail,
    Keep: crawlKeep,
    Delete: crawlDelete,
    Stage: crawlStage,
    screenGet: screenGet,
    screenStage: screenStage,
    screenDelete: screenDelete,
    docImage: docImage,
    test: test
};