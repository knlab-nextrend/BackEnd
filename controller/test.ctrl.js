
const solrDB = require("../../models/solr/index").solrDB;
const fs = require('fs');
const path = require('path');
const nasCtrl = require('../controller/nas/nasService.ctrl');
const esCtrl = require('../controller/es/esService.ctrl');
const libs = require('../lib/libs');
const poliDB = require("../../models/politica/index");
const dayjs = require("dayjs");
const nextrendDB = require("../../models/nextrend/index");
const crypto = require("crypto");
const jwt = require("../../modules/jwt");
const redisClient = require("../../modules/redis");
const jsftp = require("jsftp");
const ftp = require('basic-ftp');

const esDB = require("../../models/es/index").esDB;
const esConfig = require("../../models/es/index").config;

const NasFTP = require("../../models/nas/index");
const thumbRoute = NasFTP.thumbRoute;
const pdfRoute = NasFTP.pdfRoute;
const uploadRoute = NasFTP.uploadRoute;
const webServer = NasFTP.webServer;
const nasConfig = NasFTP.config;