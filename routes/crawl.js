const express = require("express");
const router = express.Router();
const crawlSearch = require("../controller/fusion");
const authJWT = require("../middlewares/auth");

router.get('/list/:statusCode',authJWT,crawlSearch.Search);
router.get('/insert/',authJWT,crawlSearch.Insert);

module.exports = router;
