const express = require("express");
const router = express.Router();
const userService = require("../service/userService");
const tokenCtrl = require("../service/tokenService");
const categoryService = require("../service/categorysService");
const loginService = require("../service/loginService");
const testService = require("../service/testService");
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
router.get("/categorys/dict",categoryService.Todict);
router.get("/categorys/",categoryService.getCodes);
router.get("/continents/",categoryService.getConti);
router.get("/countrys/:conti",categoryService.getCountry);

router.get("/test",testService.test);

module.exports = router;
