const esCtrl = require("../service/es/esService");
const nasCtrl = require("../service/nas/nasService");
//const fileCtrl = require("./file.ctrl");
const uploadCtrl = require("../service/nextrend/uploadFile");
const libs = require("../lib/libs");
const jwt = require("../modules/jwt");
const poliCtrl = require("../service/politica/poliService");
const userCtrl = require("../service/nextrend/user");
const dayjs = require("dayjs");
const es = require("../models/es");
const fileCtrl = require("../service/file");
const phpDB = require("../models/php/index");
const db = require("../models/nextrend");
const promiseDB = require("../models/nextrend_promise");

const docCatViewer = (doc) => new Promise(async(resolve,reject)=>{
    let newDoc = Object.assign({},doc);
    const fieldList = {
        doc_country:3,
        doc_publish_country:3,
        doc_category:1,
        doc_language:4,
        doc_content_type:2,
        doc_custom:6,
        doc_content_category:2,
        doc_topic:5,
        CATEGORY:1,
        COUNTRY:3,
        LANG:4,
    };
    for (const [key,catType] of Object.entries(fieldList)){
        try{
            let converted = [];
            doc[key] = Array.isArray(doc[key])? doc[key]:[doc[key]];
            if(doc[key].length!==0){
                for (let valueId of doc[key]) {
                    const valueInfo = await codeCtrl.getInfoById(valueId,catType);
                    if(valueInfo[0]){
                        converted.push(valueInfo[0]);
                    }
                };
                if(key in newDoc){
                    newDoc[key] = converted;
                }
            }
        }catch(e){
            continue;
        }
    }
    if('doc_host' in newDoc){
        if(newDoc.doc_host){
            try{
                const data = await hostCtrl.read(newDoc.doc_host)
                newDoc.doc_host = data;
            }catch(e){
            }
        }
    }
    resolve(newDoc);
})

// 페이지를 벗어날 때, _id만으로 작업중이던 nas에 등록된 contentImage 파일들을 삭제함.
const docImageDetach = async (req, res) => {
    if (req.query._id) {
        try {
            await fileCtrl.deleteComparedContentImage(req.query._id)
            res.send();
        } catch (e) {
            console.log(e);
            res.status(400).send({ message: e })
        }
    } else {
        res.status(400).send({ message: '_id is not given' })
    }
}

const docImageAttach = async (req, res) => {
    if (req.file) {
        try {
            const result = await esCtrl.Detail(req.body._id);
            let thumbnail = result.body.hits.hits[0]._source.doc_thumbnail;
            if(Array.isArray(thumbnail)){
                thumbnail = thumbnail[0];
            }
            const splited = thumbnail.split(/(?=\/)/g);
            let serverIP;
            let nasCoverPath;
            let contentPath;
            if(splited.includes('/data_nas')){
                serverIP = '1.214.203.131:3330';
                nasCoverPath = splited.slice(-4).join('');
                contentPath = nasCoverPath + '/contentImage/';
            }else{
                serverIP = splited[0];
                nasCoverPath = splited.slice(1, -1).join('');
                contentPath = nasCoverPath + '/contentImage/';
            }
            const existError = await nasCtrl.checkThenMakeFolder(contentPath, type = 'image');

            if (existError) {
                throw 'error occured during access to nas';
            }

            // 이 시점에서는 폴더가 만들어져 있음. 업로드 진행.
            const uploadError = await nasCtrl.uploadFile(req.file, contentPath, type = 'image');
            if (uploadError) {
                // 업로드 실패시 throw
                throw 'error occured put file to nas storage';
            } else {
                // 모든 작업 수행 성공 시 fileRoute를 반환.
                const fileRoute = serverIP + contentPath + req.file.filename;
                fileCtrl.unlinkFile(req.file.path);
                res.send(fileRoute);
            }

        } catch (e) {
            // exception으로 인한 에러 시, 직접 file을 unlink 해줌. 에러 메세지를 그대로 전달.
            fileCtrl.unlinkFile(req.file.path);
            res.status(400).send({ message: e });
        }
    } else {
        res.status(400).send({ message: 'file not attached' });
    }
}

const uploadExcelData = async (req, res) => {

    let pdfs = req.files.pdfs;
    let thumbnails = req.files.thumbnails;

    const metaData = JSON.parse(req.body.meta);

    //pdf, 썸네일 값이 있으면 NAS에 저장 후 es에 저장
    if (pdfs && thumbnails) {
        
        const folderDate = dayjs().locale('se-kr').format('/YYYY/MM');

        //meta = es에 들어갈 데이터
        //es에 맞는 pdf와 thumbnail을 설정함
        metaData.forEach((meta)=>{
            let pdf = pdfs.filter(pdf=>pdf.originalname === meta.pdf_file_name);
            pdf = pdf ? pdf[0] : null;

            let thumbnail = thumbnails.filter(img=>img.originalname === meta.thumbnail_file_name);
            thumbnail = thumbnail ? thumbnail[0] : null;

            meta.pdf = pdf;
            meta.thumbnail = thumbnail;
        })
        try {
            const tableError = await uploadCtrl.checkUploadTable();
            if (tableError) {
                throw 'some problems with upload table';
            }
            
            //meta마다 pdf랑 썸네일 업로드
            metaData.forEach(async (meta)=>{
                let folderPath = folderDate + '/' + meta.dc_domain + '/';
                
                //pdf 업로드
                const existErrorPDF = await nasCtrl.checkThenMakeFolder(folderPath, type = 'pdf');
                if (existErrorPDF) {
                    throw 'error occured during access to nas';
                }
                const uploadErrorPDF = await nasCtrl.uploadFile(meta.pdf, folderPath, type = 'pdf');
                if (uploadErrorPDF) {
                    // 업로드 실패시 throw
                    throw 'error occured put file to nas storage';
                }
                
                //썸네일 업로드
                const existErrorThumb = await nasCtrl.checkThenMakeFolder(folderPath, type = 'image');
                if (existErrorThumb) {
                    throw 'error occured during access to nas';
                }
                const uploadErrorThumb = await nasCtrl.uploadFile(meta.thumbnail, folderPath, type = 'image');
                if (uploadErrorThumb) {
                    // 업로드 실패시 throw
                    throw 'error occured put file to nas storage';
                } 

                //서버에 임시로 받아져있는 파일들 삭제
                fileCtrl.unlinkFile(meta.thumbnail.path);
                fileCtrl.unlinkFile(meta.pdf.path);

                const uploadedData = await uploadCtrl.insertUploadedFile(meta.pdf.filename, req.uid);
                const itemId = uploadedData.insertId;
                await poliCtrl.insertUploadData(itemId, meta.dc_page);

                meta.doc_file = folderPath + meta.pdf.filename + '.pdf';
                meta.doc_thumbnail = folderPath + meta.thumbnail.filename + ".png";
                meta.item_id= itemId;

                delete meta.pdf;
                delete meta.thumbnail;

                meta.is_crawled = false;
                const _id = await esCtrl.Index(meta, 6, false, true);
                await uploadCtrl.updateId(_id, itemId);
            })
        } catch (e) {
            res.status(400).send({ message: e });
        }
    } 
    //pdf, 썸네일 값이 없으면 es에만 저장 
    else{
        metaData.forEach(async (meta)=>{

            meta.is_crawled = false;
            const _id = await esCtrl.Index(meta, 6, false, true);
            
        })

    }
    res.send();
}

const getExcelData = async (req, res)=>{
    try{
        const page = parseInt(req.query.page || "1");
        const general = (req.query.general === "true");

        delete req.query.general;

        const query = libs.reqToEsFilters({
            is_crawled : false,
            pageNo : page,
            listSize : 20,
            ...req.query
        },8, [],[],[], general);

        let result = await esCtrl.Search(query);

        const document = [];
        for(let doc of result.docs){
            doc = await docCatViewer(doc);
            document.push(doc);
        }
        result.docs = document;
        if (result) {
            result.docs.forEach((doc) => {
                if (doc["stat"] === undefined) {
                    doc["stat"] = 0;
                }
            });
            res.send(result);
        } else {
            res.status(400).send();
        }}catch(e){res.status(400).send();}
}

const getExcelDetail = async (req,res)=>{
    try{
        let result = await esCtrl.Detail(req.query.PID);

        res.status(200).send(result.body.hits.hits);
    }catch(e){
        res.status(400).send({message : e});
    }
}

const migration = async (req, res) =>{

    let [results, fields]= await phpDB.execute(`select a.IDX as item_id, a.STAT as status, 
     a.DC_TITLE_OR as doc_origin_title, a.DC_TITLE_KR as doc_kor_title ,a.DC_SMRY_KR as doc_kor_summary, 
     a.DC_DT_COLLECT as doc_collect_date, a.DC_DT_WRITE as doc_publish_date, 
     a.DC_DT_REGI as doc_register_date, a.DC_URL_LOC as doc_url, 
     a.DC_AGENCY as doc_publisher ,a.DC_PAGE as doc_page, 
     a.DC_TYPE as doc_content_type , 
     a.DC_CONTENT as doc_content, a.DC_HIT as doc_hit ,a.DC_LINK as doc_bundle_url,a.DC_CAT as doc_content_category,
     b.CT_NM as doc_custom, a.DC_MEMO1 as doc_thumbnail, a.DC_MEMO2 as doc_file,
     b.CT_NM as doc_category, a.DC_COUNTRY as doc_country,
     a.DC_KEYWORD as doc_keyowrd ,a.DC_MEMO1 as doc_file ,a.DC_MEMO2 as doc_thumbnail 
     from nt_document_list a left join nt_categorys b on a.DC_CODE=b.CODE where a.stat < 9`);

    for(let i = 0; i < results.length; i++){
        const date = new Date(Number(results[i].doc_publish_date) * 1000)
        const fieldList = {
            doc_country:3,
            doc_publish_country:3,
            doc_category:1,
            doc_language:4,
            doc_custom:6,
            doc_content_category:2,
            doc_content_type:2,
            doc_topic:5
        };
        

        let keywords = null
        if(results[i].doc_keyowrd)
            keywords = results[i].doc_keyowrd.split(",").map(str=>str.trim())
        results[i] = {
            ...results[i],
            is_crawled: false,
            doc_thumbnail : (results[i].doc_thumbnail != null ? "1.214.203.131:3330/files/legacy/thumbnails/" + results[i].doc_thumbnail : null),
            doc_file : (results[i].doc_file != null ? "1.214.203.131:3330/files/legacy/pdfs/" + results[i].doc_file : null),
            doc_page : (results[i].doc_page instanceof Number ? results[i].doc_page : null),
            doc_publish_date : dayjs(Number(results[i].doc_publish_date) * 1000).locale('se-kr').format().split('+')[0], 
            doc_register_date : dayjs(Number(results[i].doc_register_date) * 1000).locale('se-kr').format().split('+')[0], 
            doc_keyowrd : keywords,
        }
        const uploadedData = await uploadCtrl.insertUploadedFile(results[i].doc_thumbnail, 69);
        const _id = await esCtrl.Index(results[i], 8, false, true);
        await uploadCtrl.updateId(_id, results[i].item_id);
    }
    res.send(results)
}

module.exports = {
    docImageAttach: docImageAttach,
    docImageDetach: docImageDetach,
    uploadExcelData: uploadExcelData,
    getExcelData : getExcelData,
    getExcelDetail : getExcelDetail,
    migration : migration
}