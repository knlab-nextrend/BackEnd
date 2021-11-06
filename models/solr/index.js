
const solr = require('solr-client');
const path = require('path');
const dbtype = process.env.NODE_ENV || 'solr';
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..','..', 'configs', 'db.json'))[dbtype][env];

const solrDB = solr.createClient(
    host=config.host,
    port=config.port,
    core=config.core
);

/*
@param{ String | Object }[host='127.0.0.1']- IP address or host address of the Solr server
@param{ Number | String }[port='8983']- port of the Solr server
@param{ String }[core='']- name of the Solr core requested
@param{ String }[path='/solr']- root path of all requests
@param{ http.Agent }[agent]- HTTP Agent which is used for pooling sockets used in HTTP(s) client requests
@param{ Boolean }[secure=false]- if true HTTPS will be used instead of HTTP
@param{ Boolean }[bigint=false]- if true JSONbig serializer/deserializer will be used instead
@param{ solrVersion }['3.2','4.0', '5.0', '5.1'], check lib/utils/version.js for full reference
@returnClient
@apipublic
*/

module.exports = {
    solrDB:solrDB,
    config:config
};