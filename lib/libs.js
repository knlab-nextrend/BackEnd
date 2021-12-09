// 필드 타입 array인 것을 확인한 후, length가 1보다 작을 시 해당 요소 반환.
const listChecker = (field) => {
    if(Array.isArray(field)){
        if(field.length>1){
            return field;
        }else{
            return field[0];
        }
    }
}


const convertCrawlDocTo = (document,type,restrict=false) => {
    let newDocument = {};
    switch(type){
        case 'solr':
            //11.15 기준 screening 출력 전용 데이터 제한하기.
            if(restrict){
                newDocument["item_id"]=document["item_id"]||"";
                newDocument["dc_dt_collect"]=listChecker(document["created_at"])||"1970-01-01T00:00:00+00:00";
                newDocument["dc_publisher"]=listChecker(document["host"])||null;
                newDocument["dc_page"]=listChecker(document["pages"])||0;
                newDocument["dc_lang"]=listChecker(document["language"])||null;
                newDocument["dc_smry_kr"]=listChecker(document["summary"])||null;
                return newDocument;
            }else{
                newDocument["item_id"]=document["item_id"]||"";
                newDocument["dc_title_or"]=listChecker(document["title"])||null;
                newDocument["dc_dt_collect"]=listChecker(document["lastmodified"])||"1970-01-01T00:00:00+00:00";
                newDocument["dc_url_loc"]=decodeURIComponent(document["url"])||null;
                newDocument["dc_page"]=listChecker(document["pages"])||0;
                newDocument["dc_keyword"]=document["keywords"]||[];
                newDocument["dc_content"]=document["contents"]||null;
                newDocument["dc_publisher"]=listChecker(document["host"])||null;
                newDocument["dc_smry_kr"]=listChecker(document["summary"])||null;
                newDocument["dc_lang"]=listChecker(document["language"])||null;
                newDocument["dc_cover"]=document["thumbnail"]||[];
                newDocument["dc_file"]=document["storageSrc"]||null;
                return newDocument;
            }
        case 'els':
            return document;
    }
}

module.exports = {
    convertCrawlDocTo:convertCrawlDocTo
}