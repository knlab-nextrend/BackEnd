const codeCtrl = require("../controller/nextrend/code.ctrl");
const nationCtrl = require("../controller/nextrend/nation.ctrl");

const codeList = async (req,res) => {
    const data = await codeCtrl.ToDict();
    if(data){
        res.send(data);
    }else{
        res.status(400).send({message:"codeList error"});
    }
}

const contiList = async (req,res) => {
    const data = await nationCtrl.getConti();
    if(data){
        res.send(data);
    }else{
        res.status(400).send({message:"contiList error"});
    }
}

const countryList = async (req,res) => {
    const data = await nationCtrl.getCountry(req.params.conti);
    if(data){
        res.send(data);
    }else{
        res.status(400).send({message:"countryList error"});
    }
}

module.exports = {
    getCode:codeList,
    getConti:contiList,
    getCountry:countryList,
}