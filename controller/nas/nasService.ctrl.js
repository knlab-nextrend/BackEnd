const jsftp = require("jsftp");
const path = require('path');
const fs = require('fs');

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
const getFileList = (path) => new Promise(async (resolve, reject) => {
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

const checkFolderExist = (folderPath,type=false) => new Promise(async (resolve, reject) => {
    const subPath = pathTypeCatcher(type).subPath;
    const client = new jsftp(config);
    client.ls(subPath.slice(0,-1)+folderPath, (err, res) => {
        console.log(res);
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

const uploadFile = (file, filePath, type=false) => new Promise(async (resolve, reject) => {
    const pathList = pathTypeCatcher(type);
    const subPath = pathList.subPath;
    const tailPath = pathList.tailPath;
    const client = new jsftp(config);

    const stream = await fs.createReadStream('C:\\home\\BackEnd\\images\\'+file.filename);
    console.log(stream);
    console.log('C:\\home\\BackEnd\\images\\'+file.filename,subPath.slice(0,-1)+filePath+file.filename+tailPath);
    console.log(client);
    client.put(stream, subPath.slice(0,-1)+filePath+file.filename+tailPath, (err, res) => {
        console.log(res,err);
        if (err) {
            resolve(err);
        } else {
            resolve(false);
        }
    });
});

module.exports = {
    getImage: getFileList,
    uploadFile: uploadFile,
    checkFolderExist: checkFolderExist,
    makeFolder: makeFolder
}