const ftp = require('basic-ftp');

const path = require('path');
const dbtype = process.env.NODE_ENV || 'nas';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];

const connetToFTP = async () =>{
    const client = new ftp.Client();
    await client.access(config);
    return client;
}

const get = async () =>{
    let client = await connetToFTP();
    return client;
}

const client = get();

//client.ftp.verbose = true
console.dir(client);


module.exports = {
    client:client
};