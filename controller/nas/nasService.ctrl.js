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
            if('[.]png|[.]jpg'.search(path[0])){
                const splited = path[0].split('thumbnail/');
                resolve([webServer+thumbRoute+splited[splited.length-1]]);
            }else{
                await client.ls(thumbRoute+path[0],(err,res)=>{
                    if(err){
                        resolve([]);
                    }else{
                        //이미지 경로 생성
                        res.forEach(file => fileList.push(webServer+'/'+path[0]+'/'+file.name));
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