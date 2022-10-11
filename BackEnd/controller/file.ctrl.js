const esCtrl = require("../service/es/esService");
const nasCtrl = require("../service/nas/nasService");
const fileCtrl = require("./file.ctrl");
const uploadCtrl = require("../service/nextrend/uploadFile");
const libs = require("../lib/libs");
const jwt = require("../modules/jwt");
const poliCtrl = require("../service/politica/poliService");
const userCtrl = require("../service/nextrend/user");
const dayjs = require("dayjs");
const fileService = require("../service/file")


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
    if (req.files) {
        let metaDict = {};
        const metaData = JSON.parse(req.body.meta);
        const folderDate = dayjs().locale('se-kr').format('/YYYY/MM');
        metaData.forEach((meta) => {
            metaDict[meta.pdf_file_name] = meta;
        });
        let pdfFolderPath;
        try {
            const tableError = await uploadCtrl.checkUploadTable();
            if (tableError) {
                throw 'some problems with upload table';
            }
            req.files.forEach(async (file) => {
                let fileMeta = metaDict[file.originalname];
                pdfFolderPath = folderDate + '/' + fileMeta.dc_domain + '/';
                const existError = await nasCtrl.checkThenMakeFolder(pdfFolderPath, type = 'pdf');
                if (existError) {
                    throw 'error occured during access to nas';
                }
                const uploadError = await nasCtrl.uploadFile(file, pdfFolderPath, type = 'pdf');
                if (uploadError) {
                    // 업로드 실패시 throw
                    throw 'error occured put file to nas storage';
                } else {
                    fileCtrl.unlinkFile(file.path);
                }
                const uploadedData = await uploadCtrl.insertUploadedFile(file.filename, req.uid);
                const itemId = uploadedData.insertId;
                await poliCtrl.insertUploadData(itemId, fileMeta.dc_page);
                fileMeta['is_crawled'] = false;
                fileMeta['dc_file'] = pdfFolderPath + file.filename + '.pdf';
                fileMeta['item_id'] = itemId;
                const _id = await esCtrl.Index(fileMeta, 8);
                await uploadCtrl.updateId(_id, itemId);
            })
            res.send();
        } catch (e) {
            res.status(400).send({ message: e });
        }
    } else {
        res.send();
    }
}

const getExcelData = async (req, res)=>{
    const page = parseInt(req.query.page || "1");
    
    const result = await fileService.getExcelDataList(req.query);

    res.send(result)
}


module.exports = {
    docImageAttach: docImageAttach,
    docImageDetach: docImageDetach,
    uploadExcelData: uploadExcelData,
    getExcelData : getExcelData
}