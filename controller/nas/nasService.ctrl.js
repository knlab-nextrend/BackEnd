const jsftp = require("jsftp");

const NasFTP = require("../../models/nas/index");
const thumbRoute = NasFTP.thumbRoute;
const webServer = NasFTP.webServer;
const config = NasFTP.config;

//주어진 폴더 아래 모든 파일 조회하여 array로 리턴
const getFileList = (path) => new Promise(async(resolve,reject) => {
    const client = new jsftp(config);
    let fileList=[];
    if(Array.isArray(path)){
        if(path.length>0){
            let splited = path[0].split('.');
            const underThumb = path[0].split('thumbnail/');
            if(splited[splited.length-1]=='png'){
                resolve([webServer+thumbRoute+underThumb[underThumb.length-1]]);
            }else{
                await client.ls(thumbRoute+underThumb[underThumb.length-1],(err,res)=>{
                    if(err){
                        resolve([]);
                    }else{
                        //이미지 경로 생성
                        res.forEach(file => fileList.push(webServer+'/'+underThumb[underThumb.length-1]+'/'+file.name));
                        if(fileList.length){
                            resolve(fileList);
                        }else{
                            resolve([]);
                        }
                    }
                });
            }
        }else{
            resolve([]);
        }
    }else{
        resolve([]);
    }   
});

const uploadImage = (image) => new Promise(async(resolve,reject)=>{
    
})

module.exports = {
    getImage:getFileList
}