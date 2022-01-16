const express = require("express");
const router = express.Router();
const crawlService = require("../service/crawlService");
const authJWT = require("../middlewares/auth");

router.get('/list/:statusCode',authJWT,crawlService.Search);

//단일 데이터 컨트롤 단계 , 11/15 단계 재정의 이후 조정 필요.
router.get('/detail/:itemId',authJWT,crawlService.Detail);
router.put('/detail/:itemId',authJWT,crawlService.Keep); //보류 시, 해당 DB의 stat만 변경.
router.delete('/detail/:itemId',authJWT,crawlService.Delete); //스크리닝 단계에서는 완전 삭제, 2차 및 큐레이션 단계에서는 stat=8,9로 전환.
router.post('/detail/:itemId',authJWT,crawlService.Stage); //다음 공정으로 데이터 이관

router.get('/screening/',authJWT,crawlService.screenGet); //스크리닝 데이터 조회
router.put('/screening/',authJWT,crawlService.screenStage); //스크리닝 데이터 이관
router.delete('/screening/',authJWT,crawlService.screenDelete); //스크리닝 데이터 삭제
router.post('/screening/',authJWT,crawlService.screenKeep);

module.exports = router;
