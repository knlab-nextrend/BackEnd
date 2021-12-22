const solrCtrl = require("../controller/solr/solrService.ctrl");
const elsCtrl = require("../controller/els/elsService.ctrl");
const nasCtrl = require("../controller/nas/nasService.ctrl");
const poliCtrl = require("../controller/politica/poliService.ctrl");
const fileCtrl = require("../controller/nextrend/files.ctrl");
const path = require("path");
const libs = require("../../lib/libs");

// prev와 curr은 dc_content를 담고 있음.
const deleteComparedContentImage = (prev,curr) => new Promise(async (resolve,reject) =>{
    const prevImage = libs.ImageExtractorFromContent(prev);
    const currImage = libs.ImageExtractorFromContent(curr);

    // null 처리
    if(currImage===null){
        // prev 이미지 모두 삭제... nas 삭제 모듈 사용해야겠지.
    }else{
        if(prevImage===null){
            // prev 이미지가 없다면, 아무것도 수행하지 않음.
            resolve(true);
        }else{

        }
    }
});