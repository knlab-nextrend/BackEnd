const express = require("express");
const router = express.Router();

const crawlSearch = require("../controller/fusion");

router.get('/list/:statusCode',crawlSearch.Search);
router.get('/insert/',crawlSearch.Insert);

module.exports = router;
