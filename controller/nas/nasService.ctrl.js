const jsftp = require("jsftp");

const NasFTP = require("../../models/nas/index");
const thumbRoute = NasFTP.thumbRoute;
const webServer = NasFTP.webServer;
const config = NasFTP.config;

//주어진 폴더 아래 모든 파일 조회하여 array로 리턴
const getFileList = (path) => new Promise(async(resolve,reject) => {
    const client = new jsftp(config);
    let fileList=[];
    await client.ls(thumbRoute+path,(err,res)=>{
        if(err){
            resolve([]);
        }else{
            //이미지 경로 생성
            res.forEach(file => fileList.push(webServer+'/'+path+'/'+file.name));
            if(fileList.length){
                resolve(fileList);
            }else{
                resolve([]);
            }
        }
    });
});

const uploadImage = (iamge) => new Promise(async(resolve,reject)=>{
    
})

module.exports = {
    getImage:getFileList
}