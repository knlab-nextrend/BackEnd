const express = require("express");
const router = express.Router();
const crawlCtrl = require("../controller/crawl.ctrl");
const authJWT = require("../middlewares/auth");
const boardCtrl = require("../controller/board.ctrl");
const ping = require("../middlewares/ping");

router.get('/list/:statusCode',crawlCtrl.Search);

//단일 데이터 컨트롤 단계 , 11/15 단계 재정의 이후 조정 필요.
router.get('/detail/:_id',authJWT,crawlCtrl.Detail);
router.put('/detail/:_id',authJWT,crawlCtrl.Keep); //보류 시, 해당 DB의 stat만 변경.
router.delete('/detail/:_id',authJWT,crawlCtrl.Delete); //스크리닝 단계에서는 완전 삭제, 2차 및 큐레이션 단계에서는 stat=8,9로 전환.
router.post('/detail/:_id',authJWT,ping,crawlCtrl.Stage); //다음 공정으로 데이터 이관

router.get('/screening/',crawlCtrl.screenGet); //스크리닝 데이터 조회
router.put('/screening/',ping,authJWT,crawlCtrl.screenStage); //스크리닝 데이터 이관
router.delete('/screening/',authJWT,crawlCtrl.screenDelete); //스크리닝 데이터 삭제
router.post('/screening/',authJWT,crawlCtrl.screenKeep);

router.get('/host/',boardCtrl.crawlHostInfo);
router.get('/host/:host_id',boardCtrl.crawlHostInfo);
router.get('/sum/',boardCtrl.crawlerSummationLog);

module.exports = router;
