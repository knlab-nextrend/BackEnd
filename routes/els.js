const express = require("express");
const router = express.Router();
const captionCtrl = require("../controller/els/caption.ctrl");

router.get('/caption/search',captionCtrl.Search);

module.exports = router;