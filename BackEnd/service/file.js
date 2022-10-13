const fs = require('fs');
const path = require('path');
const nasCtrl = require('./nas/nasService');
const esCtrl = require('./es/esService');
const libs = require('../lib/libs');
const phpDB = require('../models/php/index');


const unlinkFile = (filePath) => new Promise((resolve, reject)=>{
    fs.unlinkSync(path.resolve(filePath),(err,res)=>{
        if(err){
            reject(err);
        }else{
            resolve(true);
        }
   }); 
});

// 무조건 prev 는 nas 결과, curr 는 target 으로 구성...
const deleteComparedContentImage = (_id,target=null) => new Promise(async (resolve,reject) =>{
    const result = await esCtrl.Detail(_id);
    const itemDetail = result.body.hits.hits[0]._source;
    // 본문에 image가 없더라도 cover를 통해 경로 추출.. 
    //TODO: link 필드가 생성되면 그것을 사용하여 모두 바꾸기..
    if(Array.isArray(itemDetail.doc_thumbnail)){
        itemDetail.doc_thumbnail = itemDetail.doc_thumbnail[0];
    }
    if(itemDetail.doc_thumbnail){
        const imageFolderPath = libs.folderExtractorFromCover(itemDetail.doc_thumbnail)+'/contentImage/';
        const fileList = await nasCtrl.getFileList(imageFolderPath);
        let currImage;
    
        if(target===null){
            // target이 null인 경우는 페이지를 벗어나는 경우, 원래 저장되있던 본문으로 돌아감.
            currImage = libs.ImageExtractorFromContent(itemDetail.doc_content);
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
    }else{
        resolve(true);
    }
});


const getExcelDataList = (params)=>new Promise(async (resolve, reject)=>{
    const page = (parseInt(params.page || "1")-1) * 20;
    const country = params.country ? ` and DC_COUNTRY like '%${params.country}%'`  : "";
    const originalTitle = params.orgtitle? ` and DC_TITLE_OR like '%${params.orgtitle}%'` : "";
    const krTitle = params.krtitle ? ` and DC_TITLE_KR like '%${params.krtitle}%'` : "";
    const agencyTitle = params.agencytitle? ` and DC_AGENCY like '%${params.agencytitle}%'` : "";
    const dcType = params.dctype ? ` and DC_TYPE like '%${params.dctype}%'` : ""
    const summary = params.summary ? ` and DC_CONTENT like '%${params.summary}%'` : ""


    let query = `select DISTINCT(a.IDX) as IDX, a.DC_COUNTRY as country, a.DC_TYPE as doc_type, a.DC_AGENCY as agency, a.DC_TITLE_OR as original_title, \
    a.DC_TITLE_KR as kr_title, a.DC_PAGE as page, a.DC_MEMO1 as attatchment, a.DC_URL_LOC as link from nt_document_list a \
    where a.STAT < 9${country}${originalTitle}${krTitle}${agencyTitle}${dcType}${summary}\
    ORDER BY a.IDX DESC LIMIT ${page},20;`
    
    try{
        let [ results ]  = await phpDB.query(query);

        results = results.map((row, idx)=>{
            return {index : idx+1+page, ...row}
        });
        resolve(results);
    }catch(err) {reject(err);}
    
})

const getExcelDataDetail = (pid)=>new Promise(async (resolve, reject)=>{
    try{
        const query = `select a.DC_TITLE_OR as original_title, a.DC_AGENCY as agency, \
        a.DC_DT_WRITE as writed_time ,a.DC_PAGE as page, a.DC_COUNTRY as country, \
        a.DC_TYPE as doc_type, a.DC_CODE as ct_name, a.DC_KEYWORD as keyword, a.DC_URL_LOC as url, \
        a.DC_SMRY_KR as kr_summary, a.DC_CONTENT as content, a.DC_LINK as link from nt_document_list a where IDX=${pid};`
    
        let [ results ] = await phpDB.query(query);

        let result = results[0];

        const codeQuery = `select CT_NM from nt_categorys where CODE like ${result.ct_name} and TYPE=1;`;
        
        //주제분류 코드로 한글 값 조회 후 result 객체에 넣기
        
        let [ ctNameResult ]= await phpDB.query(codeQuery);
        
        result.ct_name = ctNameResult[0].CT_NM;

        //연관 링크의 PID(IDX) 리스트, 없으면 패스
        if([null, '', ' '].includes(result.link)){
            result.link = [];
            resolve(result);
        }

        let links = result.link.split(" ");
        
        links = links.map(async (link)=>{
                const [ linkResult ] = await phpDB.query(`select DC_TITLE_KR,DC_DT_WRITE from nt_document_list where idx like ${link};`[0])
                link.kr_title = linkResult.DC_TITLE_KR;
                link.writed_time = linkResult.DC_DT_WRITE;
        });

        result.link = links;

        resolve(result);

    }catch(err){reject(err);}
})



module.exports={
    unlinkFile:unlinkFile,
    deleteComparedContentImage:deleteComparedContentImage,
    getExcelDataList : getExcelDataList,
    getExcelDataDetail : getExcelDataDetail
}