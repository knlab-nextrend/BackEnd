const customCtrl = require("../controller/nextrend/customPage.ctrl");

const createSetting = async (req,res) => {
    if(req.body.xaxis&&req.body.yaxis&&req.body.uid){
        try{
            const wid = req.uid;
            await customCtrl.create(req.body.uid,req.body.xaxis,req.body.yaxis,wid);
            res.send();
        }catch(e){
            res.status(400).send({message:e});
        }
    }else{
        res.status(400).send({message:"not enough information to create"});
    }
}

const updateSetting = async(req,res) => {
    if(req.body.uid&&req.body.xaxis&&req.body.yaxis){
        try{
            const wid = req.uid;
            await customCtrl.update(req.body.uid,req.body.xaxis,req.body.yaxis,wid);
            res.send();
        }catch(e){
            res.status(400).send({message:e});
        }
    }else{
        res.status(400).send({message:"not enough information to update"});
    }
}

const deleteSetting = async(req,res) => {
    if(req.query.idx){
        try{
            await customCtrl.delete(req.query.idx);
            res.send();
        }catch(e){
            res.status(400).send({message:e});
        }
    }else{
        res.status(400).send({message:"no given idx"});
    }
}

const readSetting = async(req,res) => {
    try{
        const result = await customCtrl.read(req.query.uid);
        res.send(result);
    }catch(e){
        res.status(400).send({message:e});
    }
}

const testAxis = async(req,res) => {
    try{
        const result = await customCtrl.test(req.query.cid);
        res.send(result);
    }catch(e){
        res.status(400).send({message:e});
    }
}

const loadPage = async(req,res) => {
    try{
        const xAxisList = await customCtrl.call(req.query.uid,'axis_x');
        const yAxisList = await customCtrl.call(req.query.uid,'axis_y');
        const axis = {
            axis_x : xAxisList,
            axis_y : yAxisList
        };
        res.send(axis);
    }catch(e){
        res.status(400).send({message:e});
    }
}

module.exports={
    create:createSetting,
    update:updateSetting,
    delete:deleteSetting,
    read:readSetting,
    loadPage:loadPage,
    testAxis:testAxis
}