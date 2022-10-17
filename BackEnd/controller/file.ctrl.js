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

    if (pdfs && thumbnails) {
        const metaData = JSON.parse(req.body.meta);
        const folderDate = dayjs().locale('se-kr').format('/YYYY/MM');

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

                meta.is_crawled = false;
                meta.doc_file = folderPath + meta.pdf.filename + '.pdf';
                meta.doc_thumbnail = folderPath + meta.thumbnail.filename + ".png";
                meta.item_id= itemId;

                delete meta.pdf;
                delete meta.thumbnail;
                
                const _id = await esCtrl.Index(meta, 8, false, true);
                await uploadCtrl.updateId(_id, itemId);
            })
        } catch (e) {
            res.status(400).send({ message: e });
        }


        res.send();
    } else {
        res.status(400).send({"message" : "파일이 제대로 전달되지 않았습니다."});
    }

}

const getExcelData = async (req, res)=>{
    try{
        const page = parseInt(req.query.page || "1");
        const query = libs.reqToEsFilters({
            is_crawled : false,
            pageNo : page,
            listSize : 20,
            ...req.query
        })

        let result = await esCtrl.Search(query);

        res.status(200).send(result.docs);
    }catch(e){
        res.status(400).send({message : e});
    }
    
}

const getExcelDetail = async (req,res)=>{
    try{
        let result = await esCtrl.Detail(req.query.PID);

        res.status(200).send(result.body.hits.hits);
    }catch(e){
        res.status(400).send({message : e});
    }
}



module.exports = {
    docImageAttach: docImageAttach,
    docImageDetach: docImageDetach,
    uploadExcelData: uploadExcelData,
    getExcelData : getExcelData,
    getExcelDetail : getExcelDetail
}