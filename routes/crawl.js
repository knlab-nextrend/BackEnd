const express = require("express");
const router = express.Router();

const crawlSearch = require("../controller/fusion");

router.get('/list/:id',crawlSearch);

module.exports = router;
