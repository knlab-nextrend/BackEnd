const esServiceCtrl = require("../service/es/esService");
const customCtrl = require("../service/nextrend/customPage");
const libs = require("../lib/libs");
const { listeners } = require("../models/nextrend");
const crawlCtrl = require("./crawl.ctrl");

const AXIS_X_TYPE = 0;
const AXIS_Y_TYPE = 1;

const createSetting = async (req, res) => {
    if (req.body.xaxis && req.body.yaxis && req.body.uid) {
        try {
            const wid = req.uid;

            // xais를 DB에 추가
            req.body.xaxis.forEach(async xaxis=>{
                await customCtrl.create(req.body.uid, xaxis, AXIS_X_TYPE, wid);
            })
            
            req.body.yaxis.forEach(async yaxis=>{
                await customCtrl.create(req.body.uid, yaxis, AXIS_Y_TYPE, wid);
            })

            res.send();
        } catch (e) {
            res.status(400).send({ message: e });
        }
    } else {
        res.status(400).send({ message: "not enough information to create" });
    }
}

// deprecated 되어야함.
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
    if (req.body.idx) {
        try {
            
            req.body.idx.forEach(async (idx)=>{
                await customCtrl.delete(idx);
            })

            res.sendStatus(200)
        } catch (e) {
            res.status(400).send({ message: e });
        }
    } else {
        res.status(400).send({ message: "no given idx" });
    }
}

//사용자의 axis들을 모두 읽어옴
const readSetting = async (req, res) => {
    try {
        const x_result = await customCtrl.read(req.query.uid, AXIS_X_TYPE);
        const y_result = await customCtrl.read(req.query.uid, AXIS_Y_TYPE);
        
        res.send({"x_axis" : x_result, "y_axis" : y_result});
    } catch (e) {
        res.status(400).send({ message: e });
    }
}

const testAxis = async (req, res) => {
    try {
        const result = await customCtrl.test(req.query.uid);
        res.send(result);
    } catch (e) {
        res.status(400).send({ message: e });
    }
}

//readSettings로 대체되어 사용할듯
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
    if (req.query.axis) {
        try {
            let should = [];
            let must = [];
            const reqAxis = JSON.parse(req.query.axis);
            for (const [type, values] of Object.entries(reqAxis)) {
                const keys = Object.keys(fieldList).filter(key => fieldList[key] === parseInt(type));
                if(keys.length>1){
                    keys.forEach((field) => {
                        let tempDict = {};
                        values.forEach(value=>{
                            tempDict[field] = value + '.*';
                            should.push({regexp:tempDict});
                        })
                })
                }else{
                    let tempDict = {};
                    values.forEach(value=>{
                        tempDict[keys[0]] = value + '.*';
                        must.push({regexp:tempDict});
                    })
                }
                
            }
            const reqCode= parseInt(req.query.statusCode);
            let stat = (reqCode===6||reqCode===7)? [6,7]:8
            const searchQuery = libs.reqToEsFilters(req.query,stat,must,should);
            let result = await esServiceCtrl.Search(searchQuery)
            const document = [];
            for(let doc of result.docs){
                doc = await crawlCtrl.docCatViewer(doc);
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