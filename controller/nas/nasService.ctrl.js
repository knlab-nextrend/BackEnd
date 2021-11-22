const NasFTP = require("../../models/nas/index");
const thumbRoute = NasFTP.thumbRoute;
const webServer = NasFTP.webServer;

const getFileList = (path) => new Promise((resolve,reject) => {
    let fileList=[];
    NasFTP.client.ls(thumbRoute+path,(err,res)=>{
        if(err){
            console.log(err);
            resolve(false);
        }else{
            //이미지 경로 생성
            res.forEach(file => fileList.push(webServer+'/'+path+file.name));
            if(fileList.length){
                resolve(fileList);
            }else{
                resolve(false);
            }
        }
    });
    
});

module.exports = {
    getImage:getFileList
}