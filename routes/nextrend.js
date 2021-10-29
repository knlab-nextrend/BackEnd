const express = require("express");
const router = express.Router();
const loginCtrl = require("../controller/nextrend/login.ctrl");
const userCtrl = require("../controller/nextrend/user.ctrl");
const categorysCtrl = require("../controller/nextrend/categorys.ctrl");

router.post("/user/add", userCtrl.Add);
router.get("/user/get", userCtrl.Get);
router.post("/user/modify", userCtrl.Modify);
router.post("/user/delete", userCtrl.Delete);

router.get("/login/attempt", loginCtrl.Attempt);
router.post("/login/hashPw", loginCtrl.HashPW);
router.post("/login/onLogin",loginCtrl.OnLogin);

router.get("/categorys/",categorysCtrl.ToDict);

module.exports = router;
