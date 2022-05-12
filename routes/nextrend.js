const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.ctrl");
const tokenCtrl = require("../controller/token.ctrl");
const categoryCtrl = require("../controller/categorys.ctrl");
const loginCtrl = require("../controller/login.ctrl");
const testCtrl = require("../controller/test.ctrl");
const customCtrl = require("../controller/custom.ctrl");
const multiCtrl = require("../controller/multi.ctrl");
const hostCtrl = require("../controller/host.ctrl");
const authJWT = require("../middlewares/auth");
const boardCtrl = require("../controller/board.ctrl");

router.post("/user/restrict",userCtrl.Restrict);
router.post("/user/add", userCtrl.Add);
router.get("/user/list", userCtrl.List);
router.get("/user/get", userCtrl.Get);
router.post("/user/modify", userCtrl.Modify);
router.post("/user/delete", userCtrl.Delete);
router.post("/user/verify", userCtrl.Verify);

router.get("/user/",authJWT,tokenCtrl.getUser);
router.get("/refresh/",tokenCtrl.refresh);

router.post("/login/",loginCtrl.Login);

router.get("/countrys/dict",categoryCtrl.countryToDict);
// 나라를 dict로 변환해서 주는거,, 이것도 그냥 쓰면 되쥬? 3번으로. 
router.get("/categorys/dict",categoryCtrl.Todict); //type 파라미터 필수.
router.get("/categorys/",categoryCtrl.getCodes);
// 조회 기능, /cat/[GET] 에 type, length, code를 부여하면 해당 메뉴 확인 가능.
router.get("/continents/",categoryCtrl.getConti);
// 대륙 조회, /cat/[GET] 에 type 3을 주면 해결.
router.get("/countrys/:conti",categoryCtrl.getCountry);
// 대륙에 맞는 국가 조회.. /cat/[GET] 에 type 3, code, length 부여

router.get("/cat/",categoryCtrl.readCat);
router.post("/cat/",categoryCtrl.createCat);
router.put("/cat/",categoryCtrl.updateCat);
router.delete("/cat/",categoryCtrl.deleteCat);

router.get("/custom/",customCtrl.read);
router.post("/custom/",authJWT,customCtrl.create);
router.put("/custom/",authJWT,customCtrl.update);
router.delete("/custom/",authJWT,customCtrl.delete);

router.get("/custom/load",customCtrl.loadPage);
router.get("/custom/test",customCtrl.testAxis);
router.get("/custom/search",customCtrl.customSearch);

router.get("/multilingual/",multiCtrl.read);
router.post("/multilingual/",authJWT,multiCtrl.create);
router.put("/multilingual/",authJWT,multiCtrl.update);
router.delete("/multilingual/",authJWT,multiCtrl.delete);
router.post("/multilingual/upload",authJWT,multiCtrl.uploadExcelFile);

router.put("/host/sync",hostCtrl.syncHostTables);
router.get("/host/",hostCtrl.readHostInfo);
router.post("/host/",hostCtrl.insertHostInfo);
router.post("/host/test",hostCtrl.insertTestingHost);
router.get("/host/test",hostCtrl.getTestingHostList);
router.put("/host/test",hostCtrl.stageTestingHost);
router.delete("/host/test",hostCtrl.deleteTestingHost);


router.get("/board/",boardCtrl.crawlInfoPerCountry);
router.get("/board/work/",boardCtrl.getWorkingLog);
router.get("/board/curation/",boardCtrl.getCurationLog);
router.get("/board/all/",boardCtrl.getAllLog);
// 시간이 너무 오래걸릴 경우, 본문 내용 분리 고려

router.get('/viewPage/');
// 해당 엔드포인트를 사용하여 view 페이지 렌더링.

router.get("/test",testCtrl.test);

module.exports = router;
