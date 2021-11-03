const express = require("express");
const router = express.Router();
const imageUrl = require("../controller/nas/fileList.ctrl");
const crawlSearch = require("../service/crawlService");

router.get('/list/:statusCode',crawlSearch.Search);
router.get('/detail/:itemId',crawlSearch.Search);
router.get('/insert/',crawlSearch.Insert);
router.get('/test/',imageUrl.getImage);

module.exports = router;
