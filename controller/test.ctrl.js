
const solrDB = require("../models/solr/index").solrDB;
const fs = require('fs');
const path = require('path');
const nasCtrl = require('../controller/nas/nasService.ctrl');
const esCtrl = require('../controller/es/esService.ctrl');
const libs = require('../lib/libs');
const poliDB = require("../models/politica/index");
const dayjs = require("dayjs");
const nextrendDB = require("../models/nextrend/index");
const crypto = require("crypto");
const jwt = require("../modules/jwt");
const redisClient = require("../modules/redis");
const jsftp = require("jsftp");
const ftp = require('basic-ftp');

const esDB = require("../models/es/index").esDB;
const esConfig = require("../models/es/index").config;

const NasFTP = require("../models/nas/index");
const { truncate } = require("fs/promises");
const thumbRoute = NasFTP.thumbRoute;
const pdfRoute = NasFTP.pdfRoute;
const uploadRoute = NasFTP.uploadRoute;
const webServer = NasFTP.webServer;
const nasConfig = NasFTP.config;

const nextrendPing = () => new Promise(async (resolve, reject) => {
    nextrendDB.getConnection((err, connection) => {
        if (err) {
            reject(err)
        } else {
            connection.ping()
            connection.release()
            resolve(true)
        }
    })
})


const esPing = () => new Promise(async (resolve, reject) => {
    try {
        await esDB.ping();
        resolve(true);
    } catch (e) {
        reject(e)
    }
})


const nasPing = () => new Promise(async (resolve, reject) => {
    const client = new ftp.Client();
    try {
        await client.access(nasConfig);
        console.log(await client.list('.'))
        resolve(true);
    } catch (e) {
        reject(e)
    }
    client.close();
})


const poliPing = () => new Promise(async (resolve, reject) => {
    poliDB.getConnection((err, connection) => {
        if (err) {
            reject(err)
        } else {
            connection.ping()
            connection.release()
            resolve(true)
        }
    })
})

const solrPing = () => new Promise(async (resolve, reject) => {
    try {
        await solrDB.ping()
        resolve(true)
    } catch (e) {
        reject(e)
    }
})

module.exports = {
    nextrendPing: nextrendPing,
    esPing: esPing,
    nasPing: nasPing,
    poliPing: poliPing,
    solrPing: solrPing
}
