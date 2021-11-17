const express = require("express");
const router = express.Router();
const imageUrl = require("../controller/nas/fileList.ctrl");
const crawlService = require("../service/crawlService");
const authJWT = require("../middlewares/auth");

router.get('/list/:statusCode',crawlService.Search);
router.get('/detail/:itemId',authJWT,crawlService.Detail);
router.put('/detail/:itemId',crawlService.Keep); //보류 시, 해당 DB의 stat만 변경.
router.delete('/detail/:itemId',authJWT,crawlService.Delete); //스크리닝 단계에서는 완전 삭제, 2차 및 큐레이션 단계에서는 stat=8,9로 전환.
router.post('/detail/:itemId',crawlService.Stage); //다음 공정으로 데이터 이관
router.get('/test/',crawlService.image);

router.get('/screening/'); //스크리닝 데이터 조회
router.put('/screening/'); //스크리닝 데이터 이관
router.delete('/screening/'); //스크리닝 데이터 삭제

module.exports = router;
