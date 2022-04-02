const express = require("express");
const router = express.Router();
const crawlService = require("../service/crawlService");
const authJWT = require("../middlewares/auth");
const boardService = require("../service/boardService");
const ping = require("../middlewares/ping");

router.get('/list/:statusCode',crawlService.Search);

//단일 데이터 컨트롤 단계 , 11/15 단계 재정의 이후 조정 필요.
router.get('/detail/:_id',authJWT,crawlService.Detail);
router.put('/detail/:_id',authJWT,crawlService.Keep); //보류 시, 해당 DB의 stat만 변경.
router.delete('/detail/:_id',authJWT,crawlService.Delete); //스크리닝 단계에서는 완전 삭제, 2차 및 큐레이션 단계에서는 stat=8,9로 전환.
router.post('/detail/:_id',authJWT,ping,crawlService.Stage); //다음 공정으로 데이터 이관

router.get('/screening/',crawlService.screenGet); //스크리닝 데이터 조회
router.put('/screening/',ping,authJWT,crawlService.screenStage); //스크리닝 데이터 이관
router.delete('/screening/',authJWT,crawlService.screenDelete); //스크리닝 데이터 삭제
router.post('/screening/',authJWT,crawlService.screenKeep);

router.get('/host/',boardService.crawlHostInfo);
router.get('/host/:host_id',boardService.crawlHostInfo);
router.get('/sum/',boardService.crawlerSummationLog);

module.exports = router;
