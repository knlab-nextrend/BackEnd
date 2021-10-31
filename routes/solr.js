const express = require("express");
const router = express.Router();
const procGet = require("../controller/solr/proc.ctrl");

router.get('/list/',procGet.Search);

module.exports = router;
