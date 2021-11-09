const express = require("express");
const router = express.Router();
const userService = require("../service/userService");
const tokenCtrl = require("../controller/token");
const categoryService = require("../service/categorysService");
const loginService = require("../service/loginService");
const authJWT = require("../middlewares/auth");

router.get("/user/",authJWT,tokenCtrl.getUser);
router.post("/user/add", userService.Add);
router.get("/user/get", authJWT,userService.List);
router.post("/user/modify", userService.Modify);
router.post("/user/delete", userService.Delete);

router.post("/login/",loginService.Login);

router.get("/categorys/",categoryService.getCode);
router.get("/continents/:conti",categoryService.getConti);
router.get("/countrys/",categoryService.getCountry);


module.exports = router;
