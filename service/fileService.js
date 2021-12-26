const esCtrl = require("../controller/es/esService.ctrl");
const nasCtrl = require("../controller/nas/nasService.ctrl");
const fileCtrl = require("../controller/file.ctrl");
const libs = require("../lib/libs");

// 페이지를 벗어날 때, item_id만으로 작업중이던 nas에 등록된 contentImage 파일들을 삭제함.
const docImageDetach = async (req,res) => {
    if(req.query.itemId){
        try{
            await fileCtrl.deleteComparedContentImage(req.query.itemId)
            res.send();
        }catch(e){
            console.log(e);
            res.status(400).send({message:e})
        }
    }else{
        res.status(400).send({message:'item_id is not given'})
    }
}

const docImageAttach = async (req, res) => {
    if (req.file) {
        try {
            const result = await esCtrl.Detail(req.body.itemId);

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
                if(uploadError){
                    // 업로드 실패시 throw
                    throw 'error occured put file to nas storage';
                }else{
                    // 모든 작업 수행 성공 시 fileRoute를 반환.
                    const fileRoute = serverIP+contentPath+req.file.filename;
                    fileCtrl.unlinkFile(req.file.path);
                    res.send(fileRoute);
                }
            } else {
                throw 'not given itemid';
            }
        } catch (e) {
            // exception으로 인한 에러 시, 직접 file을 unlink 해줌. 에러 메세지를 그대로 전달.
            fileCtrl.unlinkFile(req.file.path);
            res.status(400).send({message:e});
        }
    } else {
        res.status(400).send({message:'file not attached'});
    }
}

const uploadExcelData = async (req,res) => {
    console.log(req.files);
    console.log(req.body.meta);
}

module.exports ={
    docImageAttach: docImageAttach,
    docImageDetach:docImageDetach,
    uploadExcelData:uploadExcelData
}