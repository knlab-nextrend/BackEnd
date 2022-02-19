const codeCtrl = require("../controller/nextrend/subjectCode.ctrl");
const subjectCodeCtrl = require("../controller/nextrend/subjectCode.ctrl");
const categoryCtrl = require("../controller/nextrend/categorys.ctrl");

const readCat = async (req,res) => {
    if(!req.query.type){
        res.status(400).send({message:'type not exists'})
    }else{
        const length = req.query.length||2;
        const code = req.query.code||null;
        try{
            const result = await categoryCtrl.read(length,req.query.type,code);
            res.send(result);
        }catch(e){
            res.status(400).send({message:e});
        }
    }
}

const createCat = async (req,res) => {
    if((!req.body.type)||(!req.body.length)||(!req.body.ct_nm)){
        res.status(400).send({message:'value not exists'})
    }else{
        const code = req.body.code||null;
        try{
            const result = await categoryCtrl.create(req.body.length,req.body.type,req.body.ct_nm,code);
            res.send(result);
        }catch(e){
            res.status(400).send({message:e});
        }
    }
}

const updateCat = async (req,res) => {
    if((!req.body.type)||(!req.body.code)||(!req.body.ct_nm)){
        res.status(400).send({message:'value not exists'})
    }else{
        try{
            const result = await categoryCtrl.update(req.body.type,req.body.code,req.body.ct_nm);
            res.send(result);
        }catch(e){
            res.status(400).send({message:e});
        }
    }
}

const deleteCat = async (req,res) => {
    if((!req.query.type)||(!req.query.code)){
        res.status(400).send({message:'value not exists'})
    }else{
        try{
            const result = await categoryCtrl.delete(req.query.type,req.query.code);
            res.send(result);
        }catch(e){
            res.status(400).send({message:e});
        }
    }
}

const codeList = async (req,res) => {
    const code = req.query.upperCode;
    const data = await codeCtrl.getCodes(code);
    if(data){
        res.send(data);
    }else{
        res.status(400).send({message:"codeList error"});
    }
}

const toDict = async (req,res) => {
    if(!req.query.type){
        res.status(400).send();
    }else{
        try{
            const data = await subjectCodeCtrl.ToDict(req.query.type);
            res.send(data);
        }catch(e){
            res.status(400).send({message:"toDict error"});
        }
    }
}

module.exports = {
    getCodes:codeList,
    Todict:toDict,
    readCat:readCat,
    createCat:createCat,
    updateCat:updateCat,
    deleteCat:deleteCat
}