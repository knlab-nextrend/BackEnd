const fs = require('fs');
const path = require('path');
const nasCtrl = require('../controller/nas/nasService.ctrl');
const esCtrl = require('../controller/es/esService.ctrl');
const libs = require('../lib/libs');

const unlinkFile = (filePath) => new Promise((resolve, reject)=>{
    fs.unlinkSync(path.resolve(filePath),(err,res)=>{
        if(err){
            resolve(false);
        }else{
            resolve(true);
        }
   }); 
});

// 무조건 prev 는 nas 결과, curr 는 target 으로 구성...
const deleteComparedContentImage = (itemId,target=null) => new Promise(async (resolve,reject) =>{
    const itemDetail = await esCtrl.Detail(itemId);
    // 본문에 image가 없더라도 cover를 통해 경로 추출.. 
    //TODO: link 필드가 생성되면 그것을 사용하여 모두 바꾸기..

    const imageFolderPath = libs.folderExtractorFromCover(itemDetail.docs.dc_cover[0])+'/contentImage/';
    const fileList = await nasCtrl.getFileList(imageFolderPath);
    let currImage;

    if(target===null){
        // target이 null인 경우는 페이지를 벗어나는 경우, 원래 저장되 있던 본문으로 돌아감.
        currImage = libs.ImageExtractorFromContent(itemDetail.docs.dc_content);
    }else{
        currImage = libs.ImageExtractorFromContent(target);
    }

    // fileList는 무조건 nas contentImage 폴더를 참조함.
    if(fileList){
        let oldFileList = [];
        fileList.forEach((file)=>{
            oldFileList.push(file.split('.png')[0]);
        })
        if(currImage===null){
            // fileList의 이미지 모두 삭제...
            oldFileList.forEach(async(fileName)=>{
                await nasCtrl.deleteFile(imageFolderPath+fileName,'image');
            })
            resolve(true);
        }else{
            // 둘 다 있는 경우라면, 비교를 통해 삭제할 목록 추리기.
            const compResult = libs.compareArray(oldFileList,currImage.imageName);
            if(compResult.delete.length===0){
                // 존재하는 파일이 모두 keep 대상이라면
                resolve(true);
            }else{
                compResult.delete.forEach(async(fileName)=>{
                    await nasCtrl.deleteFile(imageFolderPath+fileName,'image');
                })
                resolve(true);
            }
        }
    }else{
        // nas 폴더에 아무것도 없으면 아무것도 실행하지 않음.. (이것도 에러인데..)
        resolve(true);
    }
});

module.exports={
    unlinkFile:unlinkFile,
    deleteComparedContentImage:deleteComparedContentImage
}