
const convertCrawlDocTo = (document,type,restrict=false) => {
    let newDocument = {};
    switch(type){
        case 'solr':
            //11.15 기준 screening 출력 전용 데이터 제한하기.
            if(restrict){
                newDocument["item_id"]=document["item_id"]||"";
                newDocument["dc_dt_collect"]=document["created_at"]||"1970-01-01T00:00:00+00:00";
                newDocument["dc_publisher"]=document["host"]||"";
                newDocument["dc_page"]=document["pages"]||"";
                newDocument["dc_lang"]=document["language"]||"";
                newDocument["dc_smry_kr"]=document["summary"]||"";
                return newDocument;
            }else{
                newDocument["item_id"]=document["item_id"]||"";
                newDocument["dc_title_or"]=document["title"]||null;
                newDocument["dc_dt_collect"]=document["lastmodified"]||"1970-01-01T00:00:00+00:00";
                newDocument["dc_url_loc"]=decodeURIComponent(document["url"])||null;
                newDocument["dc_page"]=document["pages"]||0;
                newDocument["dc_keyword"]=document["keywords"]||[];
                newDocument["dc_content"]=document["contents"]||null;
                newDocument["dc_publisher"]=document["host"]||null;
                newDocument["dc_smry_kr"]=document["summary"]||null;
                newDocument["dc_lang"]=document["language"]||null;
                newDocument["dc_cover"]=document["thumbnailstorageSrc"]||[];
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