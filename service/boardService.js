const boardCtrl = require("../controller/nextrend/dashBoard.ctrl");
const esServiceCtrl = require("../controller/es/esService.ctrl");
const solrServiceCtrl = require("../controller/solr/solrService.ctrl");
const dayjs = require("dayjs");

const crawlInfoPerCountry = async(req,res) => {
    if(req.query.status){
        let countries = {};
        const hostWithCountry = await boardCtrl.selectHostNation();
        hostWithCountry.forEach(host => {
            if(host.country in countries){
                countries[host.country].push(host.host);
            }else{
                countries[host.country]=[host.host];
            }
        });
        switch(parseInt(req.query.status)){
            case 0:
                try{
                    let condition = {
                        listSize:1,
                        start:0
                    };
                    let result = Object.assign({},countries);
                    for (const [country, hosts] of Object.entries(countries)) {
                        let host = '('+hosts.join(' OR ')+')';
                        condition.host = host;
                        const searchResult = await solrServiceCtrl.Search(condition,0)
                        result[country]=searchResult.dcCount;
                      }
                    res.send(result);
                }catch(e){
                    res.status(400).send(e);
                }
                break;
            case 2:
                try{
                    const monthBefore = dayjs().locale('se-kr').subtract(1, "month").format().split('+')[0];
                    let filters = {
                        dc_keyword: req.query.dc_keyword || '',
                        dc_publisher: req.query.dc_publisher || '',
                        dateGte: req.query.dateGte || '*',
                        dateLte: req.query.dateLte || '*',
                        pageGte: monthBefore,
                        pageLte: req.query.pageLte || '*',
                        is_crawled: req.query.is_crawled || '',
                        sort: req.query.sort || 'desc',
                        sortType: 'doc_register_date'
                    };
                    
                    let result = Object.assign({},countries);
                    for (const [country, hosts] of Object.entries(countries)) {
                        let host = '('+hosts.join(' OR ')+')';
                        filters['host'] = host;
                        const searchResult = await esServiceCtrl.Search(10,0,2,filters,{},[])
                        result[country]=searchResult.dcCount;
                      }
                    res.send(result)
                }catch(e){
                    console.log(e)
                    res.status(400).send(e)
                }
                break;
        }
    }
    
    
}

module.exports={
    crawlInfoPerCountry:crawlInfoPerCountry
}