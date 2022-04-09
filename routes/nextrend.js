const express = require("express");
const router = express.Router();
const userService = require("../service/userService");
const tokenCtrl = require("../service/tokenService");
const categoryService = require("../service/categorysService");
const loginService = require("../service/loginService");
const testService = require("../service/testService");
const customService = require("../service/customService");
const multiService = require("../service/multiService");
const hostService = require("../service/hostService");
const authJWT = require("../middlewares/auth");
const boardService = require("../service/boardService");

router.post("/user/restrict",userService.Restrict);
router.post("/user/add", userService.Add);
router.get("/user/list", userService.List);
router.get("/user/get", userService.Get);
router.post("/user/modify", userService.Modify);
router.post("/user/delete", userService.Delete);
router.post("/user/verify", userService.Verify);

router.get("/user/",authJWT,tokenCtrl.getUser);
router.get("/refresh/",tokenCtrl.refresh);

router.post("/login/",loginService.Login);

router.get("/countrys/dict",categoryService.countryToDict);
// 나라를 dict로 변환해서 주는거,, 이것도 그냥 쓰면 되쥬? 3번으로. 
router.get("/categorys/dict",categoryService.Todict); //type 파라미터 필수.
router.get("/categorys/",categoryService.getCodes);
// 조회 기능, /cat/[GET] 에 type, length, code를 부여하면 해당 메뉴 확인 가능.
router.get("/continents/",categoryService.getConti);
// 대륙 조회, /cat/[GET] 에 type 3을 주면 해결.
router.get("/countrys/:conti",categoryService.getCountry);
// 대륙에 맞는 국가 조회.. /cat/[GET] 에 type 3, code, length 부여

router.get("/cat/",categoryService.readCat);
router.post("/cat/",categoryService.createCat);
router.put("/cat/",categoryService.updateCat);
router.delete("/cat/",categoryService.deleteCat);

router.get("/custom/",customService.read);
router.post("/custom/",authJWT,customService.create);
router.put("/custom/",authJWT,customService.update);
router.delete("/custom/",authJWT,customService.delete);

router.get("/custom/load",customService.loadPage);
router.get("/custom/test",customService.testAxis);
router.get("/custom/search",customService.customSearch);

router.get("/multilingual/",multiService.read);
router.post("/multilingual/",authJWT,multiService.create);
router.put("/multilingual/",authJWT,multiService.update);
router.delete("/multilingual/",authJWT,multiService.delete);
router.post("/multilingual/upload",authJWT,multiService.uploadExcelFile);

router.get("/host/poli",hostService.getHostListInfo);
router.get("/host/",hostService.readHostInfo);
router.post("/host/",hostService.insertHostInfo);

router.get("/board/",boardService.crawlInfoPerCountry);
router.get("/board/work/",boardService.getWorkingLog);
router.get("/board/curation/",boardService.getCurationLog);
router.get("/board/all/",boardService.getAllLog);
// 시간이 너무 오래걸릴 경우, 본문 내용 분리 고려

router.get('/viewPage/');
// 해당 엔드포인트를 사용하여 view 페이지 렌더링.

router.get("/test",testService.test);

module.exports = router;
