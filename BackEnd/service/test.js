
const solrDB = require("../models/solr/index").solrDB;
const poliDB = require("../models/politica/index");
const nextrendDB = require("../models/nextrend/index");
const ftp = require('basic-ftp');

const esDB = require("../models/es/index").esDB;

const NasFTP = require("../models/nas/index");
const customErrors = require("../modules/error");
const nasConfig = NasFTP.config;

const nextrendPing = () => new Promise(async (resolve, reject) => {
    nextrendDB.getConnection((err, connection) => {
        if (err) {
            reject(customErrors(err,422))
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
        reject(customErrors(e,420))
    }   
})


const nasPing = () => new Promise(async (resolve, reject) => {
    const client = new ftp.Client(timeout = 5000);
    try {
        await client.access(nasConfig);
        resolve(true);
    } catch (e) {
        reject(customErrors(e,424))
    }
    client.close();
})


const poliPing = () => new Promise(async (resolve, reject) => {
    poliDB.getConnection((err, connection) => {
        if (err) {
            reject(customErrors(err,423))
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
        reject(customErrors(e,421))
    }
})

module.exports = {
    nextrendPing: nextrendPing,
    esPing: esPing,
    nasPing: nasPing,
    poliPing: poliPing,
    solrPing: solrPing
}
