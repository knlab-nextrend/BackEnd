const jsftp = require("jsftp");

const NasFTP = require("../../models/nas/index");
const thumbRoute = NasFTP.thumbRoute;
const webServer = NasFTP.webServer;
const config = NasFTP.config;

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

module.exports = {
    getImage:getFileList
}