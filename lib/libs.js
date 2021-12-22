// 필드 타입 array인 것을 확인한 후, length가 1보다 작을 시 해당 요소 반환.
const listChecker = (field) => {
    if(Array.isArray(field)){
        if(field.length>1){
            return field;
        }else{
            if(field[0]==''){
                return [];
            }else{
                return field[0];
            }
        }
    }
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
                newDocument["dc_keyword"]=listChecker(document["keywords"])||[];
                newDocument["dc_content"]=listChecker(document["contents"])||null;
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
    convertCrawlDocTo:convertCrawlDocTo,
    ImageExtractorFromContent:ImageExtractorFromContent,
    folderExtractorFromCover:folderExtractorFromCover,
    compareArray:compareArray
}