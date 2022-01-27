const dayjs = require("dayjs");

// 필드 타입 array인 것을 확인한 후, length가 1보다 작을 시 해당 요소 반환.
const listChecker = (field,merge=false) => {
    if(Array.isArray(field)){
        if(field.length>1){
            if(merge){
                let mergedText;
                field.forEach((item)=>{
                    mergedText+=item+', ';
                })
                return mergedText;
            }else{
                return field;
            }
        }else{
            if(field[0]==''){
                return [];
            }else{
                return field[0];
            }
        }
    }
}

const nullProcessing = (doc) => {
    const now = dayjs().locale('se-kr').format().split('+')[0];
    let newDoc = {};
    const keys = Object.keys(doc);
    newDoc["is_crawled"] = keys.includes("is_crawled")? doc.is_crawled : true;
    newDoc["dc_cover"] = keys.includes("dc_cover")? doc.dc_cover : [];
    newDoc["dc_file"] = keys.includes("dc_file")? doc.dc_file : null;
    newDoc["dc_lang"] = keys.includes("dc_lang")? doc.dc_lang : null;
    newDoc["dc_hit"] = keys.includes("dc_hit")? doc.dc_hit : 0;
    newDoc["dc_page"] = keys.includes("dc_page")? doc.dc_page : 0;
    newDoc["dc_dt_regi"] =  keys.includes("dc_dt_regi")? doc.dc_dt_regi : now;
    newDoc["dc_country_pub"] = keys.includes("dc_country_pub")? doc.dc_country_pub : [];
    newDoc["dc_country"] = keys.includes("dc_country")? doc.dc_country : [];
    newDoc["dc_code"] = keys.includes("dc_code")? doc.dc_code : [];
    newDoc["dc_keyword"] = keys.includes("dc_keyword")? doc.dc_keyword :[];
    newDoc["dc_link"] = keys.includes("dc_link")? doc.dc_link : null;
    newDoc["dc_smry_kr"] = keys.includes("dc_smry_kr")? doc.dc_smry_kr : null;
    newDoc["dc_title_kr"] = keys.includes("dc_title_kr")? doc.dc_title_kr : null;
    newDoc["dc_title_or"] = keys.includes("dc_title_or")? doc.dc_title_or : null;
    newDoc["dc_url_loc"] = keys.includes("dc_url_loc")? doc.dc_url_loc : null;
    newDoc["item_id"] = keys.includes("item_id")? doc.item_id : null;
    newDoc["dc_cat"] = keys.includes("dc_cat")? doc.dc_cat : null;
    newDoc["dc_type"] = keys.includes("dc_type")? doc.dc_type : null;
    newDoc["dc_publisher"] = keys.includes("dc_publisher")? doc.dc_publisher : null;
    newDoc["dc_content"] = keys.includes("dc_content")? doc.dc_content : null;
    newDoc["dc_dt_collect"] =  keys.includes("dc_dt_collect")? doc.dc_dt_collect : "1970-01-01T00:00:00+00:00";
    if(keys.includes("dc_dt_write")){
        if(newDoc.dc_dt_write===''){
            newDoc["dc_dt_write"] = "1970-01-01T00:00:00+00:00";
        }
    }else{
        newDoc["dc_dt_write"] = null;
    }
    return newDoc;
}

// 주의, stand 기준으로 있는 것과 없는 것만을 반환해줌.
const compareArray = (other,stand) => {
    if(other instanceof Array && stand instanceof Array){
        let listToKeep = [];
        if(other.length==0 && stand.length==0){
            return null;
        }else{
            stand.forEach((st)=>{
                if(other.includes(st)){
                    listToKeep.push(st);
                    other.splice(other.indexOf(st),1);
                }
            })
        }
        return {keep:listToKeep,delete:other};
    }else{
        return false;
    }
}

const folderExtractorFromCover = (cover) => {
    /* 
        [
            '1.214.203.131:3330/2021/12/www.worldbank.org/93340_Revised_IBRD_IDA_Rules_of_Procedure/93340_Revised_IBRD_IDA_Rules_of_Procedure_0.png',
            '2021/12/www.worldbank.org/93340_Revised_IBRD_IDA_Rules_of_Procedure',
            index: 0,
            input: '1.214.203.131:3330/2021/12/www.worldbank.org/93340_Revised_IBRD_IDA_Rules_of_Procedure/93340_Revised_IBRD_IDA_Rules_of_Procedure_0.png',
            groups: undefined
        ]
    */
    return cover.match(/1.214.203.131:3330\/(.*)\/.*.png/i)[1];
}

const ImageExtractorFromContent = (content) => {
    const tags = content.match(/(<p><img src="([^>]+)><\/p>)/ig);
    if(tags===null){
        return null;
    }else{
        let imageName = [];
        tags.forEach(element => {
            imageName.push(element.match(/contentImage\/(.*)\"><\/p>/i)[1]);
        });
        const folder = tags[0].match(/1.214.203.131:3330\/(.*)\/contentImage/i)[1];
        return {folder:folder,tags:tags,imageName:imageName};
    }
}

const convertCrawlDocTo = (document,type,restrict=false) => {
    let newDocument = {};
    switch(type){
        case 'solr':
            //11.15 기준 screening 출력 전용 데이터 제한하기.
            if(restrict){
                newDocument["item_id"]=listChecker(document["item_id"])||"";
                newDocument["dc_dt_collect"]=listChecker(document["recentWorkDate"])||"1970-01-01T00:00:00+00:00";
                newDocument["dc_publisher"]=listChecker(document["host"])||null;
                newDocument["dc_page"]=listChecker(document["pages"])||0;
                newDocument["dc_lang"]=listChecker(document["language"])||null;
                newDocument["dc_smry_kr"]=listChecker(document["summary"])||null;
                newDocument["dc_url_loc"]=decodeURIComponent(document["url"])||null;
                return newDocument;
            }else{
                newDocument["item_id"]=listChecker(document["item_id"])||"";
                newDocument["dc_title_or"]=listChecker(document["title"],merge=true)||null;
                newDocument["dc_dt_collect"]=listChecker(document["recentWorkDate"])||"1970-01-01T00:00:00+00:00";
                newDocument["dc_dt_pub"]=listChecker(document["lastmodified"])||"1970-01-01T00:00:00+00:00";
                newDocument["dc_url_loc"]=decodeURIComponent(document["url"])||null;
                newDocument["dc_page"]=listChecker(document["pages"])||0;
                newDocument["dc_keyword"]=listChecker(document["keywords"])||[];
                newDocument["dc_content"]=listChecker(document["contents"])||null;
                newDocument["dc_publisher"]=listChecker(document["host"])||null;
                newDocument["dc_smry_kr"]=listChecker(document["summary"])||null;
                newDocument["dc_lang"]=listChecker(document["language"])||null;
                newDocument["dc_cover"]=document["thumbnail"]||[];
                newDocument["dc_file"]=document["storageSrc"]||null;
                return newDocument;
            }
        case 'es':
            return document;
    }
}

module.exports = {
    convertCrawlDocTo:convertCrawlDocTo,
    ImageExtractorFromContent:ImageExtractorFromContent,
    folderExtractorFromCover:folderExtractorFromCover,
    compareArray:compareArray,
    nullProcessing:nullProcessing
}