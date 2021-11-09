const loginCtrl = require("../controller/nextrend/login.ctrl");

// 따로 해쉬 하는 api를 요청하는 필요성..? 없을 듯으로 보임.
const getHash = (req,res) => {
    if(req.body.userPW){
        const result = loginCtrl.HashPW(req.body.userPW);
        if(result){
            res.send(result);
        }else{
            res.status(401).send({message:"error occured on hashing pw"})
        }
    }else{
        res.status(400).send({message:"no userPW"})
    }
}

const onLogin = (req,res) => {
    if(req.body.userID&&req.body.userPW){
        const result = loginCtrl.onLogin(req.body.userID,req.body.userPW);
        if(result.message === undefined){
            res.send(result);
        }else{
            res.status(401).send({message:result.message});
        }
    }else{
        res.status(400).send({message:"no userPW or userID"})
    }
}

module.exports={
    Login:onLogin
}