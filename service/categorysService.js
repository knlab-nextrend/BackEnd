const codeCtrl = require("../controller/nextrend/subjectCode.ctrl");
const nationCtrl = require("../controller/nextrend/nation.ctrl");
const subjectCodeCtrl = require("../controller/nextrend/subjectCode.ctrl");

const codeList = async (req,res) => {
    const code = req.query.upperCode;
    const data = await codeCtrl.getCodes(code);
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

const toDict = async (req,res) => {
    const data = await subjectCodeCtrl.ToDict(req.params.conti);
    if(data){
        res.send(data);
    }else{
        res.status(400).send({message:"toDict error"});
    }
}

const countryToDict = async (req,res) => {
    const data = await nationCtrl.countryToDict();
    if(data){
        res.send(data);
    }else{
        res.status(400).send({message:"error occured during loading countries"});
    }
}
module.exports = {
    getCodes:codeList,
    getConti:contiList,
    getCountry:countryList,
    Todict:toDict,
    countryToDict:countryToDict
}