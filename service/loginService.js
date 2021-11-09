const loginCtrl = require("../controller/nextrend/login.ctrl");

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
    Login:onLogin,
    Hash:getHash
}