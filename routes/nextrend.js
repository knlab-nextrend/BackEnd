const express = require("express");
const router = express.Router();
const userService = require("../service/userService");
const tokenCtrl = require("../service/tokenService");
const categoryService = require("../service/categorysService");
const loginService = require("../service/loginService");
const testService = require("../service/testService");
const customService = require("../service/customService");
const authJWT = require("../middlewares/auth");

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
router.post("/custom/",customService.create);
router.put("/custom/",customService.update);
router.delete("/custom/",customService.delete);

router.post("/custom/load",customService.loadPage);

router.get('/viewPage/');
// 해당 엔드포인트를 사용하여 view 페이지 렌더링.

router.get("/test",testService.test);

module.exports = router;
