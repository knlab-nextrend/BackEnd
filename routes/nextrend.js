const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/nextrend/user.ctrl");
const tokenCtrl = require("../controller/token");
const categoryService = require("../service/categorysService");
const loginService = require("../service/loginService");
const authJWT = require("../middlewares/auth");

router.get("/user/",authJWT,tokenCtrl.getUser);
router.post("/user/add", userCtrl.Add);
router.get("/user/get", authJWT,userCtrl.Get);
router.post("/user/modify", userCtrl.Modify);
router.post("/user/delete", userCtrl.Delete);

router.post("/login/hashPw",authJWT, loginService.Hash);
router.post("/login/",loginService.Login);

router.get("/categorys/",categoryService.getCode);
router.get("/continents/:conti",categoryService.getConti);
router.get("/countrys/",categoryService.getCountry);


module.exports = router;
