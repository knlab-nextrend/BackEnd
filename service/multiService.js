const multiCtrl = require("../controller/nextrend/multi.ctrl");

const readMulti = async (req,res) => {
    try{
        const result = await multiCtrl.read(); 
        res.send(result);
    }catch(e){
        res.status(400).send({message:e});
    }
}

const createMulti = async (req,res) => {
    try{
        await multiCtrl.create(req.body.multi_text,req.uid); 
        res.send();
    }catch(e){
        res.status(400).send({message:e});
    }
}

const updateMulti = async (req,res) => {
    try{
        await multiCtrl.update(req.body.idx,req.body.multi_text,req.uid); 
        res.send();
    }catch(e){
        res.status(400).send({message:e});
    }
}

const deleteMulti = async (req,res) => {
    try{
        await multiCtrl.delete(req.query.idx); 
        res.send();
    }catch(e){
        res.status(400).send({message:e});
    }
}

module.exports = {
    read:readMulti,
    create:createMulti,
    update:updateMulti,
    delete:deleteMulti
}