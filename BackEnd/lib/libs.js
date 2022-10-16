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
    }else{
        return field;
    }
}

const nullProcessing = (doc) => {
    const now = dayjs().locale('se-kr').format().split('+')[0];
    let newDoc = {};
    const keys = Object.keys(doc);
    newDoc["doc_biblio"] = keys.includes("doc_biblio")? doc.doc_biblio||null : null;
    newDoc["doc_bundle_title"] = keys.includes("doc_bundle_title")? doc.doc_bundle_title||null : null;
    newDoc["doc_bundle_url"] = keys.includes("doc_bundle_url")? doc.doc_bundle_url||null : null;
    newDoc["doc_category"] = keys.includes("doc_category")? doc.doc_category||null : null;
    newDoc["doc_collect_date"] = keys.includes("doc_collect_date")? doc.doc_collect_date||null : null;
    newDoc["doc_content"] = keys.includes("doc_content")? doc.doc_content||null : null;
    newDoc["doc_content_category"] = keys.includes("doc_content_category")? doc.doc_content_category||null : null;
    newDoc["doc_content_type"] = keys.includes("doc_content_type")? doc.doc_content_type||null : null;
    newDoc["doc_country"] = keys.includes("doc_country")? doc.doc_country||null : null;
    newDoc["doc_custom"] = keys.includes("doc_custom")? doc.doc_custom||null : null;
    newDoc["doc_file"] = keys.includes("doc_file")? doc.doc_file||null : null;
    newDoc["doc_hit"] = keys.includes("doc_hit")? doc.doc_hit||null : null;
    newDoc["doc_keyowrd"] = keys.includes("doc_keyowrd")? doc.doc_keyowrd||null : null;
    newDoc["doc_kor_summary"] = keys.includes("doc_kor_summary")? doc.doc_kor_summary||null : null;
    newDoc["doc_kor_title"] = keys.includes("doc_kor_title")? doc.doc_kor_title||null : null;
    newDoc["doc_language"] = keys.includes("doc_language")? doc.doc_language||null : null;
    newDoc["doc_memo"] = keys.includes("doc_memo")? doc.doc_memo||null : null;
    newDoc["doc_modify_date"] = keys.includes("doc_modify_date")? doc.doc_modify_date||null : null;
    newDoc["doc_origin_summary"] = keys.includes("doc_origin_summary")? doc.doc_origin_summary||null : null;
    newDoc["doc_origin_title"] = keys.includes("doc_origin_title")? doc.doc_origin_title||null : null;
    newDoc["doc_page"] = keys.includes("doc_page")? doc.doc_page||null : null;
    newDoc["doc_project"] = keys.includes("doc_project")? doc.doc_project||null : null;
    newDoc["doc_publish_country"] = keys.includes("doc_publish_country")? doc.doc_publish_country||null : null;
    newDoc["doc_publisher"] = keys.includes("doc_publisher")? doc.doc_publisher||null : null;
    newDoc["doc_publish_date"] = keys.includes("doc_publish_date")? doc.doc_publish_date||null : null;
    newDoc["doc_host"] = keys.includes("doc_host")? doc.doc_host||null : null;
    newDoc["doc_publishing"] = keys.includes("doc_publishing")? doc.doc_publishing||null : null;
    newDoc["doc_recomment"] = keys.includes("doc_recomment")? doc.doc_recomment||null : null;
    newDoc["doc_register_date"] = keys.includes("doc_register_date")? doc.doc_register_date||null : now;
    newDoc["doc_relate_title"] = keys.includes("doc_relate_title")? doc.doc_relate_title||null : null;
    newDoc["doc_relate_url"] = keys.includes("doc_relate_url")? doc.doc_relate_url||null : null;
    newDoc["doc_spare1"] = keys.includes("doc_spare1")? doc.doc_spare1||null : null;
    newDoc["doc_spare2"] = keys.includes("doc_spare2")? doc.doc_spare2||null : null;
    newDoc["doc_thumbnail"] = keys.includes("doc_thumbnail")? doc.doc_thumbnail||null : null;
    newDoc["doc_topic"] = keys.includes("doc_topic")? doc.doc_topic||null : null;
    newDoc["doc_url"] = keys.includes("doc_url")? doc.doc_url||null : null;
    newDoc["doc_url_intro"] = keys.includes("doc_url_intro")? doc.doc_url_intro||null : null;
    newDoc["doc_write_date"] = keys.includes("doc_write_date")? doc.doc_write_date||null : null;
    newDoc["is_crawled"] = keys.includes("is_crawled")? doc.is_crawled||null : true;
    newDoc["item_id"] = keys.includes("item_id")? doc.item_id||null : null;
    newDoc["status"] = keys.includes("status")? doc.status||null : null;

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
    if(Array.isArray(content)){
        content = content[0]
    }
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

const reqToEsFilters = (query,stat=null,mustQ=[],shouldQ=[],filterQ=[]) => {
    let must =[];
    let should = shouldQ;
    let filters = [];
    let sort = [];
    for (const [key,value] of Object.entries(query)){
        if(key.startsWith('doc_host')){
            let tempDict={};
            tempDict[key] = value;
            must.push({match:tempDict});
        }else if(key.startsWith('doc')){
            let tempDict={};
            tempDict[key] = value + '.*';
            must.push({regexp:tempDict});
        }else if(key==='is_crawled'){
            let tempDict={};
            tempDict[key] = value;
            must.push({match:tempDict});
        }
    }
    const sortType = query.sortType||'doc_collect_date'
    if(query.dateGte||query.dateLte){
        let temp = {};
        let range = {};
        temp['gte'] = query.dateGte || '*'
        temp['lte'] = query.dateLte || '*'
        range[sortType] =temp;
        filters.push({range:range})
    }
    let sortTemp = {};
    sortTemp[sortType] = query.sort||'desc'
    sort.push(sortTemp);

    if(stat===null){
    }else if(Array.isArray(stat)){
        filters.push({ terms: { status: stat } });
    }else{
        filters.push({ term: { status: stat } });
    }

    must.push.apply(must,mustQ);
    filters.push.apply(filters,filterQ);
    const size = query.listSize||10;
    const from = query.pageNo ? ((query.pageNo - 1) * size) : 0;
    let bool = {
        minimum_should_match:Math.ceil(should.length/2)||0
    };
    if(must.length){
        bool['must']=must
    }
    if(filters.length){
        bool['filter']=filters
    }
    if(should.length){
        bool['should']=should
    }
    const searchQuery = {
        from: from,
        size: size,
        index: 'politica_service',
        body: {
            query: {
                bool : bool
            },
            sort: sort,
        }
    };

    return searchQuery;
}

const convertCrawlDocTo = (document,type,restrict=false) => {
    let newDocument = {};
    switch(type){
        case 'solr':
            //11.15 기준 screening 출력 전용 데이터 제한하기.
            if(restrict){
                newDocument["item_id"]=listChecker(document["item_id"])||"";
                newDocument["doc_collect_date"]=listChecker(document["recentWorkDate"])||null;
                //newDocument["dc_publisher"]=listChecker(document["host"])||null;
                newDocument["doc_host"]=listChecker(document["host"])||null;
                newDocument["doc_page"]=listChecker(document["pages"])||null;
                //newDocument["doc_language"]=listChecker(document["language"])||null;
                newDocument["doc_language"]=listChecker(document["language"])||null;
                newDocument["doc_origin_summary"]=listChecker(document["summary"])||null;
                newDocument["doc_url"]=decodeURIComponent(document["url"])||null;
                return newDocument;
            }else{
                newDocument["item_id"]=listChecker(document["item_id"])||"";
                newDocument["doc_origin_title"]=listChecker(document["title"],merge=true)||null;
                newDocument["doc_collect_date"]=listChecker(document["recentWorkDate"])||null;
                newDocument["doc_publish_date"]=listChecker(document["lastmodified"])||null;
                newDocument["doc_url"]=decodeURIComponent(document["url"])||null;
                newDocument["doc_url_intro"]=decodeURIComponent(document["intro_url"])||null;
                newDocument["doc_page"]=listChecker(document["pages"])||0;
                newDocument["doc_keyowrd"]=listChecker(document["keywords"])||[];
                newDocument["doc_content"]=listChecker(document["contents"])||null;
                newDocument["doc_host"]=listChecker(document["host"])||null;
                //newDocument["dc_publisher"]=listChecker(document["host"])||null;
                newDocument["doc_origin_summary"]=listChecker(document["summary"])||null;
                //newDocument["doc_language"]=listChecker(document["language"])||null;
                newDocument["doc_thumbnail"]=document["thumbnail"]||[];
                newDocument["doc_file"]=document["storageSrc"]||null;
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
    nullProcessing:nullProcessing,
    reqToEsFilters:reqToEsFilters
}