const userCtrl = require("../controller/nextrend/user.ctrl");
const loginCtrl = require("../controller/nextrend/login.ctrl");

const infoProcess = (body) => {
    const userInfo = {
        ID:body.userID,
        PW:body.userPW,
        Name:req.body.userName,
        Company:req.body.userCompany,
        Position:req.body.userPosition,
        Email:req.body.userEmail,
        Tel:req.body.userTel,
        Category:req.body.userCategory,
        salt:body.salt,
    };
    return userInfo;
}

const userGet = async (req,res) => {
    if(req.params.uid){
        const userInfo = await userCtrl.getUserByUid(req.params.uid);
        if(userInfo){
            res.send(userInfo);
        }else{
            res.status(400).send({message:"no result"});
        }
    }else{
        res.status(400).send({message:"no uid"})
    }
}

const userAdd = async (req,res) => {
    if(req.body.userID&&req.body.userPW){
        let userInfo = infoProcess(req.body);

        //pw 및 salt는 해쉬를 거친 후 저장.
        const saltResult = await loginCtrl.HashPW(req.body.userPW);
        userInfo.PW = saltResult.PW;
        userInfo.salt = saltResult.salt;

        const result = await userCtrl.Add(userInfo);
        if(result){
            res.send();
        }else{
            res.status(400).send({message:"error occured on insert query"});
        }
    }else{
        res.status(400).send({message:"must send ID, PW"})
    }
}

const userList = async (req,res) => {
    const result = await userCtrl.List();
    if(result){
        res.send(result);
    }else{
        res.status(400).send({message:"error occured on loading userlist"});
    }
}

const userModify = async (req,res) => {
    if(req.body.uid){
        let userInfo = infoProcess(req.body);

        //pw 및 salt는 해쉬를 거친 후 저장.
        const saltResult = await loginCtrl.HashPW(req.body.userPW);
        userInfo.PW = saltResult.PW;
        userInfo.salt = saltResult.salt;
        
        const result = await userCtrl.Modify(userInfo,req.body.uid);
        if(result){
            res.send();
        }else{
            res.status(400).send({message:"error occured on update userinfo"});
        }
    }else{
        res.status(400).send({message:"uid needs"});
    }
}

const userDelete = async (req,res) => {
    if(req.body.uid){
        const result = await userCtrl.Delete(req.body.uid);
        if(result){
            res.send();
        }else{
            res.status(400).send({message:"error occured on delete userinfo"});
        }
    }else{
        res.status(400).send({message:"uid needs"});
    }
}

module.exports = {
    Add:userAdd,
    Modify:userModify,
    List:userList,
    Delete:userDelete,
    Get:userGet
}