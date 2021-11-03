const express = require("express");
const router = express.Router();
const loginCtrl = require("../controller/nextrend/login.ctrl");
const userCtrl = require("../controller/nextrend/user.ctrl");
const categorysCtrl = require("../controller/nextrend/categorys.ctrl");
const tokenCtrl = require("../controller/token");
const authJWT = require("../middlewares/auth");

router.get("/user/",authJWT,tokenCtrl.getUser);
router.post("/user/add", userCtrl.Add);
router.get("/user/get", authJWT,userCtrl.Get);
router.post("/user/modify", userCtrl.Modify);
router.post("/user/delete", userCtrl.Delete);

router.get("/login/attempt", authJWT,loginCtrl.Attempt);
router.post("/login/hashPw",authJWT, loginCtrl.HashPW);
router.post("/login/",loginCtrl.OnLogin);

router.get("/categorys/",categorysCtrl.ToDict);

module.exports = router;
