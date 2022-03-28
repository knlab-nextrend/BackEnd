const poliCtrl = require("../controller/politica/poliService.ctrl");
const hostCtrl = require("../controller/nextrend/host.ctrl");

const getHostListInfo = async (req,res) => {
    try{
        const hostResult = await poliCtrl.getHostListInfo();
        res.send(hostResult);
    }catch(e){
        res.status(400).send(e);
    }
}

const insertHostInfo = async(req,res) => {
    try{
        req.body.list.forEach(async(host)=>{
            await hostCtrl.create(host.host,host.name,host.category,host.country,host.lang,host.workCycle);
        })
        res.send();
    }catch(e){
        res.status(400).send(e);
    }
}

const readHostInfo = async(req,res) => {
    try{
        let hostResult;
        if(req.query.like){
            hostResult = await hostCtrl.read(req.query.like)
        }else{
            hostResult = await hostCtrl.read()
        }
        res.send(hostResult);
    }catch(e){
        res.status(400).send(e);
    }
}

module.exports ={
    getHostListInfo:getHostListInfo,
    insertHostInfo,insertHostInfo,
    readHostInfo:readHostInfo,
}