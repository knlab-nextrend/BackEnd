const solrCtrl = require("../controller/solr/solrService.ctrl");
const esCtrl = require("../controller/es/esService.ctrl");
const nasCtrl = require("../controller/nas/nasService.ctrl");
const nationCtrl = require("../controller/nextrend/nation.ctrl");
const poliCtrl = require("../controller/politica/poliService.ctrl");
const codeCtrl = require("../controller/nextrend/subjectCode.ctrl");
const libs = require("../lib/libs");
const fileCtrl = require("../controller/file.ctrl");

/*
Document Status Code list
*/

const test = async (req, res) => {
    const result = await nasCtrl.getFileList(req.query.path);

    res.send(result);
}

//router.put('/detail/:_id',crawlSearch.Keep);
//단일 데이터 기준 
const crawlKeep = async (req, res) => {
    const _id = req.params._id;
    //안되면 params 시도 혹은 query 시도.
    if (_id === undefined) {
        res.status(400).send();
    } else {
        let statusCode = parseInt(req.body.statusCode);
        let result;
        switch (statusCode) {
            case 0:
            case 1:
                result = await solrCtrl.Keep(_id);
                break;
            case 2:
            case 3:
                // 일단 직접 지정...
                result = await esCtrl.Keep(_id, 3);
                break;
            case 4:
            case 5:
                result = await esCtrl.Keep(_id, 5);
                break;
        }
        if (result) {
            res.send(result);
        } else {
            res.status(400).send();
        }
    }
}

//router.get('/detail/:_id',crawlSearch.Detail);
const crawlDetail = async (req, res) => {
    const _id = req.params._id;
    if (_id === undefined) {
        res.status(400).send({ message: "no _id" });
    } else {
        let statusCode = parseInt(req.query.statusCode);
        let result, error = 'error';
        switch (statusCode) {
            case 0:
            case 1:
                result = await solrCtrl.Detail(_id);
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
                try {
                    value = await esCtrl.Detail(_id);
                    const document = value.body.hits.hits[0];
                    result = {
                        docs: libs.convertCrawlDocTo(document._source, 'es'),
                        _id: document._id
                    }

                    //국가 표시 조정 단계
                    let countrys = [];
                    if (result.docs["dc_country"].length !== 0) {
                        for (let countryId of result.docs["dc_country"]) {
                            const countryInfo = await codeCtrl.getInfoById(countryId, 3);
                            if (countryInfo[0]) {
                                countrys.push(countryInfo[0]);
                            }
                        }
                        result.docs["dc_country"] = countrys;
                    }

                    let countrysPub = [];
                    if (result.docs["dc_country_pub"].length !== 0) {
                        for (let countryId of result.docs["dc_country_pub"]) {
                            const countryInfo = await codeCtrl.getInfoById(countryId, 3);
                            if (countryInfo[0]) {
                                countrysPub.push(countryInfo[0]);
                            }
                        }
                        result.docs["dc_country_pub"] = countrysPub;
                    }

                    //코드 표시 조정 단계
                    let codes = [];
                    if (result.docs["dc_code"].length !== 0) {
                        for (let code of result.docs["dc_code"]) {
                            const codeInfo = await codeCtrl.getInfoById(code, 1);
                            if (codeInfo[0]) {
                                codes.push(codeInfo[0]);
                            }
                        }
                        result.docs["dc_code"] = codes;
                    }
                } catch (e) {
                    error = e;
                }
                break;
        }
        if (result) {
            res.send(result);
        } else {
            res.status(400).send({ message: error });
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
                result = await solrCtrl.Search(condition, stat = statusCode, restrict = true);
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                let filters = {
                    dc_keyword: req.query.dc_keyword || '',
                    dc_publisher: req.query.dc_publisher || '',
                    dateGte: req.query.dateGte || '*',
                    dateLte: req.query.dateLte || '*',
                    pageGte: req.query.pageGte || '*',
                    pageLte: req.query.pageLte || '*',
                    is_crawled: req.query.is_crawled || '',
                    sort: req.query.sort || 'desc',
                    sortType: req.query.sortType || 'dc_dt_collect'
                };
                let prefix = {};
                if('dc_code' in req.query){
                    prefix["dc_code"]=req.query.dc_code;
                }
                if('dc_type' in req.query){
                    prefix["dc_type_doc"]=req.query.dc_type;
                }
                if('dc_country' in req.query){
                    prefix["dc_country"]=req.query.dc_country;
                }
                if('dc_language' in req.query){
                    prefix["dc_language"]=req.query.dc_language;
                }
                if('dc_topic' in req.query){
                    prefix["dc_topic"]=req.query.dc_topic;
                }
                if('dc_custom' in req.query){
                    prefix["dc_custom"]=req.query.dc_custom;
                }

                const size = req.query.listSize;
                const from = req.query.pageNo ? ((req.query.pageNo - 1) * size) : 0;
                result = await esCtrl.Search(size, from, stat = statusCode, filters = filters, prefix = prefix);
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

//router.delete('/detail/:_id',crawlSearch.Delete);
const crawlDelete = async (req, res) => {
    const _id = req.params._id;
    if (_id === undefined) {
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
                //es 부터는 삭제가 아닌, status 9 로 부여한 후 관리.
                result = await esCtrl.Keep(_id, 9);
                break;
        }
        if (result) {
            res.send(result);
        } else {
            res.status(400).send();
        }
    }
}

//router.post('/detail/:_id',authJWT,crawlService.Stage);
//Stage 의 경우, 내용 수정이 있기 때문에 Modify로 접근하는 것이 맞음.
const crawlStage = async (req, res) => {
    const _id = req.params._id;
    let itemDetail;
    if (_id === undefined) {
        res.status(400).send();
    } else {
        let statusCode = parseInt(req.body.statusCode);
        let result;
        if (req.body.docs) {
            let doc = req.body.docs;
            doc["_id"] = _id;
            console.log(doc);
            switch (statusCode) {
                case 0:
                case 1:
                    // 순전히 추가하는 경우
                    result = await esCtrl.Index(doc, 2);
                    if (result) {
                        //delete 에서 keep 으로 삭제는 이루어지지 않음. (stat=1로 부여함으로써 삭제 조치..)
                        await solrCtrl.Keep(_id, 2);
                        res.send();
                    } else {
                        res.status(400).send({ message: "some trouble in staging" });
                    }
                    break;
                case 2:
                case 3:
                    result = await esCtrl.Index(doc, 4, _id);
                    if (result) {
                        res.send();
                    } else {
                        res.status(400).send({ message: "some trouble in staging" });
                    }
                    break;
                case 4:
                case 5:
                    result = await esCtrl.Index(doc, 6, _id);
                    if (result) {
                        res.send();
                    } else {
                        res.status(400).send({ message: "some trouble in staging" });
                    }
                    break;
                case 6:
                    // 테스트 모듈 수정 요망..
                    //const checked = await poliCtrl.checkStat(_id);
                    result = await esCtrl.Index(doc, 7, _id);
                    if (result) {
                        await poliCtrl.modSubmitStat(doc.item_id);
                        res.send();
                    } else {
                        res.status(400).send({ message: "es error" });
                    }
                    res.send();
                    break;
                case 7:
                    result = await esCtrl.Index(doc, 7, _id);
                    if (result) {
                        await fileCtrl.deleteComparedContentImage(_id, doc.dc_content);
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
Detail 에서는 es 에서만 작업되기에 solr인 스크리닝은 분리.
 */
const screenGet = async (req, res) => {
    const condition = req.query;
    let stat;
    stat = req.query.keep ? 3 : 0;
    result = await solrCtrl.Search(condition, stat = stat, restrict = true);
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
            const result = await esCtrl.Index(doc.docs, 2);
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

const screenKeep = async (req, res) => {
    const keepList = req.body.list;
    if (keepList === undefined) {
        res.status(400).send({ message: "no given keep list" });
    } else {
        const errorList = [];
        keepList.forEach(async (itemId) => {
            //stat 3은 keep list.
            const result = await solrCtrl.Keep(itemId, 3);
            if (result) {
                //정상적인 값일 때, 아무것도 수행하지 않음.
            } else {
                errorList.push(itemId);
            }
        })
        if (errorList.length) {
            res.status(400).send({ message: "cannot keep above list", list: errorList });
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
    screenKeep: screenKeep,
    test: test
};