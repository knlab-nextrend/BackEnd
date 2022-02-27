const customCtrl = require("../controller/nextrend/customPage.ctrl");

const createSetting = async (req,res) => {
    if(req.query.xaxis&&req.query.yaxis&&req.query.uid){
        try{
            const authToken = req.headers.authorization.split('Bearer ')[1];
            const decoded = await jwt.verify(authToken);
            const userID = decoded.userID;
            const userInfo = await userCtrl.getUserByUid(userID);
            const wid = userInfo.id;
            await customCtrl.create(req.query.uid,req.query.xaxis,req.query.yaxis,wid);
            res.send();
        }catch(e){
            res.status(400).send({message:e});
        }
    }else{
        res.status(400).send({message:"not enough information to create"});
    }
}

const updateSetting = async(req,res) => {
    if(req.body.idx&&req.body.uid&&req.body.xaxis&&req.body.yaxis){
        try{
            const authToken = req.headers.authorization.split('Bearer ')[1];
            const decoded = await jwt.verify(authToken);
            const userID = decoded.userID;
            const userInfo = await userCtrl.getUserByUid(userID);
            const wid = userInfo.id;
            await customCtrl.update(req.body.idx,req.body.uid,req.body.xaxis,req.body.yaxis,wid);
            res.send();
        }catch(e){
            res.status(400).send({message:e});
        }
    }else{
        res.status(400).send({message:"not enough information to update"});
    }
}

const deleteSetting = async(req,res) => {
    if(req.body.idx){
        try{
            await customCtrl.delete(req.body.idx);
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
        const result = await customCtrl.read();
        res.send(result);
    }catch(e){
        res.status(400).send({message:e});
    }
}

const loadPage = async(req,res) => {
    try{
        const xAxisList = await customCtrl.call(req.body.uid,'axis_x');
        const yAxisList = await customCtrl.call(req.body.uid,'axis_y');
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
    loadPage:loadPage
}