const jsftp = require("jsftp");
const path = require('path');
const fs = require('fs');
const ftp = require('basic-ftp');

const NasFTP = require("../../models/nas/index");
const thumbRoute = NasFTP.thumbRoute;
const webServer = NasFTP.webServer;
const config = NasFTP.config;

const pathTypeCatcher = (type) => {
    let subPath = '';
    let tailPath = '';
    switch(type){
        case 'image':
            subPath = thumbRoute;
            tailPath = '.png';
            break;
    }
    return {subPath:subPath,tailPath:tailPath};
}

//주어진 폴더 아래 모든 파일 조회하여 array로 리턴
const getImageFileList = (path) => new Promise(async (resolve, reject) => {
    const client = new jsftp(config);
    let fileList = [];
    if (Array.isArray(path)) {
        if (path.length > 0) {
            let splited = path[0].split('.');
            const underThumb = path[0].split('thumbnail/');
            if (splited[splited.length - 1] == 'png') {
                resolve([webServer + thumbRoute + underThumb[underThumb.length - 1]]);
            } else {
                await client.ls(thumbRoute + underThumb[underThumb.length - 1], (err, res) => {
                    if (err) {
                        resolve([]);
                    } else {
                        //이미지 경로 생성
                        res.forEach(file => fileList.push(webServer + '/' + underThumb[underThumb.length - 1] + '/' + file.name));
                        if (fileList.length) {
                            resolve(fileList);
                        } else {
                            resolve([]);
                        }
                    }
                });
            }
        } else {
            resolve([]);
        }
    } else {
        resolve([]);
    }
});


const getFileList = (path) => new Promise(async (resolve, reject) => {
    const client = new ftp.Client()
    try {
        await client.access(config);
        const result = await client.list(thumbRoute+path);
        if(result.code===550){
            // 폴더가 없을 경우
            resolve(false);
        }else{
            if(result.length===0){
                // 폴더 속 파일이 없을 경우
                resolve(false);
            }else{
                let fileList = [];
                result.forEach((item)=>{
                    fileList.push(item.name);
                })
                resolve(fileList);
            }
        }
    }
    catch(err) {
        resolve(false);
    }
    client.close();
});

const checkFolderExist = (folderPath,type=false) => new Promise(async (resolve, reject) => {
    const subPath = pathTypeCatcher(type).subPath;
    const client = new jsftp(config);
    client.ls(subPath.slice(0,-1)+folderPath, (err, res) => {
        if (err) {
            resolve(err);
        } else {
            resolve(false);
        }
    })
});

const makeFolder = (folderPath,type=false) => new Promise(async (resolve, reject) => {
    const subPath = pathTypeCatcher(type).subPath;
    const client = new jsftp(config);
    client.raw("mkd", subPath.slice(0,-1)+folderPath, (err, res) => {
        if (err) {
            resolve(err);
        } else {
            resolve(false);
        }
    })
});

const deleteFile = (path,type=false) => new  Promise(async (resolve, reject) => {
    const pathList = pathTypeCatcher(type);
    const subPath = pathList.subPath;
    const tailPath = pathList.tailPath;

    const client = new ftp.Client()
    try {
        await client.access(config);
        await client.remove(subPath+path+tailPath);
        resolve(false);
    }
    catch(err) {
        resolve(err);
    }
    client.close();
});

const uploadFile = (file, filePath, type=false) => new Promise(async (resolve, reject) => {
    const pathList = pathTypeCatcher(type);
    const subPath = pathList.subPath;
    const tailPath = pathList.tailPath;
    const stream = await fs.createReadStream(file.path);

    const client = new ftp.Client()
    try {
        await client.access(config);
        const result = await client.uploadFrom(stream,subPath.slice(0,-1)+filePath+file.filename+tailPath);
        if(result.code===226){
            resolve(false);
        }else{
            resolve(result);
        }
    }
    catch(err) {
        resolve(err);
    }
    client.close();
});

module.exports = {
    getImage: getImageFileList,
    getFileList:getFileList,
    uploadFile: uploadFile,
    checkFolderExist: checkFolderExist,
    makeFolder: makeFolder,
    deleteFile:deleteFile
}