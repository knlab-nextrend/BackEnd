const express = require("express");
const router = express.Router();
const docsCtrl = require("../controller/solr/docs.ctrl");

router.get('/docs/get',docsCtrl.Search);

module.exports = router;
