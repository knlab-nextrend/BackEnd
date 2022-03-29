const esServiceCtrl = require("../controller/es/esService.ctrl");
const customCtrl = require("../controller/nextrend/customPage.ctrl");
const { listeners } = require("../models/nextrend");
const crawlService = require("./crawlService");

const createSetting = async (req, res) => {
    if (req.body.xaxis && req.body.yaxis && req.body.uid) {
        try {
            const wid = req.uid;
            await customCtrl.create(req.body.uid, req.body.xaxis, req.body.yaxis, wid);
            res.send();
        } catch (e) {
            res.status(400).send({ message: e });
        }
    } else {
        res.status(400).send({ message: "not enough information to create" });
    }
}

const updateSetting = async (req, res) => {
    if (req.body.uid && req.body.xaxis && req.body.yaxis) {
        try {
            const wid = req.uid;
            await customCtrl.update(req.body.uid, req.body.xaxis, req.body.yaxis, wid);
            res.send();
        } catch (e) {
            res.status(400).send({ message: e });
        }
    } else {
        res.status(400).send({ message: "not enough information to update" });
    }
}

const deleteSetting = async (req, res) => {
    if (req.query.idx) {
        try {
            await customCtrl.delete(req.query.idx);
            res.send();
        } catch (e) {
            res.status(400).send({ message: e });
        }
    } else {
        res.status(400).send({ message: "no given idx" });
    }
}

const readSetting = async (req, res) => {
    try {
        const result = await customCtrl.read(req.query.uid);
        res.send(result);
    } catch (e) {
        res.status(400).send({ message: e });
    }
}

const testAxis = async (req, res) => {
    try {
        const result = await customCtrl.test(req.query.cid);
        res.send(result);
    } catch (e) {
        res.status(400).send({ message: e });
    }
}

const loadPage = async (req, res) => {
    try {
        const xAxisList = await customCtrl.call(req.query.uid, 'axis_x');
        const yAxisList = await customCtrl.call(req.query.uid, 'axis_y');
        const setting = await customCtrl.read(req.query.uid);
        const axis = {
            axis_x: xAxisList,
            axis_y: yAxisList,
            setting: setting
        };
        res.send(axis);
    } catch (e) {
        res.status(400).send({ message: e });
    }
}

const customSearch = async (req, res) => {
    const fieldList = {
        doc_country: 3,
        doc_publish_country: 3,
        doc_category: 1,
        doc_language: 4,
        doc_content_type: 2,
        doc_custom: 6,
        doc_content_category: 2,
        doc_topic: 5,
    };
    let filters = {
        dc_keyword: req.query.dc_keyword || '',
        dc_publisher: req.query.dc_publisher || '',
        dateGte: req.query.dateGte || '*',
        dateLte: req.query.dateLte || '*',
        pageGte: req.query.pageGte || '*',
        pageLte: req.query.pageLte || '*',
        is_crawled: req.query.is_crawled || '',
        sort: req.query.sort || 'desc',
        sortType: req.query.sortType || 'doc_collect_date'
    };
    if (req.query.axis) {
        try {
            let regexp = [];
            const reqAxis = JSON.parse(req.query.axis);
            for (const [type, value] of Object.entries(reqAxis)) {
                const keys = Object.keys(fieldList).filter(key => fieldList[key] === parseInt(type));
                keys.forEach((field) => {
                    let tempDict = {};
                    tempDict[field] = value + '.*';
                    regexp.push(tempDict);
                })
            }
            const size = req.query.listSize;
            const from = req.query.pageNo ? ((req.query.pageNo - 1) * size) : 0;
            let result = await esServiceCtrl.Search(size, from, 7, filters, {}, regexp)
            const document = [];
            for(let doc of result.docs){
                doc = await crawlService.docCatViewer(doc);
                document.push(doc);
            }
            result.docs = document;
            res.send(result);
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    }else{
        res.status(400).send();
    }
}

module.exports = {
    create: createSetting,
    update: updateSetting,
    delete: deleteSetting,
    read: readSetting,
    loadPage: loadPage,
    testAxis: testAxis,
    customSearch: customSearch
}