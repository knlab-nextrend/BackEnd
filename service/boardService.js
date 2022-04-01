const boardCtrl = require("../controller/nextrend/dashBoard.ctrl");
const esServiceCtrl = require("../controller/es/esService.ctrl");
const solrServiceCtrl = require("../controller/solr/solrService.ctrl");
const dayjs = require("dayjs");
const libs = require("../lib/libs");

const crawlInfoPerCountry = async (req, res) => {
    if (req.query.status) {
        let countriesName = {};
        let countriesIdx = {};
        const hostWithCountry = await boardCtrl.selectHostNation();
        hostWithCountry.forEach(host => {
            if (host.country in countriesName) {
                countriesName[host.country].push(host.host);
            } else {
                countriesName[host.country] = [host.host];
            }
            if (host.host_idx in countriesIdx) {
                countriesIdx[host.country].push(host.host_idx);
            } else {
                countriesIdx[host.country] = [host.host_idx];
            }
        });
        const now = dayjs().locale('se-kr').format().split('+')[0]
        const monthBefore = dayjs().locale('se-kr').subtract(1, "month").format().split('+')[0];
        switch (parseInt(req.query.status)) {
            case -1:
                try {
                    let condition = {
                        listSize: 1,
                        start: 0
                    };
                    let result = Object.assign({}, countriesName);
                    for (const [country, hosts] of Object.entries(countriesName)) {
                        let host = '(' + hosts.join(' OR ') + ')';
                        condition.host = host;
                        const searchResult = await solrServiceCtrl.Search(condition, 0)
                        result[country] = searchResult.dcCount;
                    }
                    res.send(result);
                } catch (e) {
                    res.status(400).send(e);
                }
                break;
            case 0:
                try {
                    const query = {
                        sortType: 'doc_register_date'
                    }
                    let result = Object.assign({}, countriesIdx);
                    for (const [country, idxs] of Object.entries(countriesIdx)) {
                        let should = [];
                        if (Array.isArray(idxs)) {
                            idxs.forEach((idx) => {
                                should.push({ match: { doc_host: idx } })
                            })
                        } else {
                            should.push({ match: { doc_host: idx } })
                        }
                        const searchQuery = libs.reqToEsFilters(query, null, [], should)
                        const searchResult = await esServiceCtrl.Search(searchQuery)
                        result[country] = searchResult.dcCount;
                    }
                    res.send(result)
                } catch (e) {
                    console.log(e)
                    res.status(400).send(e)
                }
                break;
            case 2:
            case 4:
            case 6:
                const intStat = parseInt(req.query.status)
                const docStat = '('+intStat.toString() +','+ (intStat+1).toString()+')'
                const range = '(DT between "'+monthBefore+'" and "'+now+'")';
                try {
                    let result = Object.assign({}, countriesIdx);
                    for (const [country, idxs] of Object.entries(countriesIdx)) {
                        let hostIdx = '(' + idxs.join(',') + ')';
                        const searchResult = await boardCtrl.selectWorkLog(docStat, 2, hostIdx,range)
                        result[country] = searchResult[0].dcCount;
                    }
                    res.send(result);
                } catch (e) {
                    console.log(e)
                    res.status(400).send(e)
                }
                break;
        }
    }


}

module.exports = {
    crawlInfoPerCountry: crawlInfoPerCountry
}