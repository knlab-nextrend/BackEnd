const listChecker = (val) => {
    if(typeof val === "object" && val!==null){
        if(val.length === 1){
            return val[0];
        }else{
            return val;
        }
    }else{
        return val;
    }
}

const convertCrawlDocTo = (document,type,restrict=false) => {
    let newDocument = {};
    switch(type){
        case 'solr':
            //11.15 기준 screening 전용 데이터 제한하기.
            if(restrict){
                if(document["item_id"]){newDocument["item_id"]=listChecker(document["item_id"])}
                if(document["created_at"]){newDocument["dc_dt_collect"]=listChecker(document["created_at"])}
                if(document["host"]){newDocument["dc_publisher"]=listChecker(document["host"])}
                if(document["pages"]){newDocument["dc_page"]=listChecker(document["pages"])}
                if(document["language"]){newDocument["dc_lang"]=listChecker(document["language"])}
                if(document["summary"]){newDocument["dc_smry_kr"]=listChecker(document["summary"])}
                return newDocument;
            }else{
                if(document["item_id"]){newDocument["item_id"]=listChecker(document["item_id"])}
                if(document["title"]){newDocument["dc_title_or"]=listChecker(document["title"])}
                if(document["created_at"]){newDocument["dc_dt_collect"]=listChecker(document["created_at"])}
                if(document["url"]){newDocument["dc_url_loc"]=listChecker(document["url"])}
                if(document["pages"]){newDocument["dc_page"]=listChecker(document["pages"])}
                if(document["keywords"]){newDocument["dc_keyword"]=document["keywords"]}
                if(document["contents"]){newDocument["dc_content"]=listChecker(document["contents"])}
                if(document["host"]){newDocument["dc_publisher"]=listChecker(document["host"])}
                if(document["summary"]){newDocument["dc_smry_kr"]=listChecker(document["summary"])}
                if(document["language"]){newDocument["dc_lang"]=listChecker(document["language"])}
                if(document["thumbnailstorageSrc"]){newDocument["dc_cover"]=listChecker(document["thumbnailstorageSrc"])}
                return newDocument;
            }
        case 'els':
            for (const [key, value] of Object.entries(document)) {
                if(key==="dc_keyword"){
                    if(typeof document[key]=='object'){
                        document[key]=value;
                    }else{
                        document[key]=[value];
                    }
                }
                else{document[key] = listChecker(value)}
            }
            return document;
    }
}

module.exports = {
    convertCrawlDocTo:convertCrawlDocTo
}