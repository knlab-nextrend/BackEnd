const userCtrl = require("../service/nextrend/user");
const loginCtrl = require("../service/nextrend/login");
const nasCtrl = require("../service/nas/nasService");

const infoProcess = (body) => {
    const userInfo = {
        ID:body.userID,
        PW:body.userPW,
        Name:body.Name,
        Company:body.Company,
        Position:body.Position,
        Email:body.Email,
        Tel:body.Tel,
        Category:body.Category,
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
    if(req.body.userInfo){

        let userInfo = infoProcess(req.body.userInfo);


        if(userInfo.PW&&userInfo.ID){
            //pw 및 salt는 해쉬를 거친 후 저장.
            const saltResult = await loginCtrl.HashPW(userInfo.PW);
            userInfo.PW = saltResult.PW;
            userInfo.salt = saltResult.salt;

            const result1 = await userCtrl.Add(userInfo);

            //사용자 로고 이미지 추가 로직
            const result = await saveLogo(req.file, userInfo.ID, result1.insertId);

            if(result){
                res.send();
            }else{
                res.status(400).send({message:"error occured on insert query"});
            }
        }else{
            res.status(400).send({message:"must send ID, PW"})
        }
    }else{
        res.status(400).send({message:"must send userInfo in body"})
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
    if(req.body.uid&&req.body.userInfo){
        let userInfo = infoProcess(req.body.userInfo);

        if(!userInfo.userID){
            userInfo.userID = userCtrl.getUserByUid(req.body.uid).userID;
        }

        if(userInfo.PW){
            //pw 및 salt는 해쉬를 거친 후 저장.
            const saltResult = await loginCtrl.HashPW(userInfo.PW);
            userInfo.PW = saltResult.PW;
            userInfo.salt = saltResult.salt;
        }
        const result = await userCtrl.Modify(userInfo,req.body.uid);

        //logo 업로드 기능 추가
        await saveLogo(req.file, userInfo.ID, result1.insertId);

        if(result){
            res.send();
        }else{
            res.status(400).send({message:"error occured on update userinfo"});
        }
    }else{
        res.status(400).send({message:"uid or userInfo needs"});
    }
}

const userDelete = async (req,res) => {
    if(req.body.uid){
        
        const userID = await userCtrl.getUserByUid(req.body.uid).userID;
        const result = await userCtrl.Delete(req.body.uid);
        await nasCtrl.deleteFile(`/${userID}/logo`, "logo");
        if(result){
            res.send();
        }else{
            res.status(400).send({message:"error occured on delete userinfo"});
        }
    }else{
        res.status(400).send({message:"uid needs"});
    }
}

const userRestrict = async (req,res) => {
    if(req.body.uid){
        try{
            await userCtrl.Restrict(req.body.uid,req.body.restrict)
        }catch(e){
            res.status(400).send({message:"error occured on modify user restriction"});
        }
        res.send();
    }else{
        res.status(400).send({message:"no restriction information"})
    }
}

const userVerify = async (req,res) => {
    const uid = req.body.id||null;
    if(req.body.userId){
        try{
            const data = await userCtrl.Verify(uid,req.body.userId);
            if(data.length){
                res.status(400).send({message:"duplicated user id"});
            }else{
                res.send();
            }
        }catch(e){
            res.status(400).send({message:"error occured"});
        }
    }else{
        res.status(400).send();
    }
}

const saveLogo = async (file, userId, UID)=>{
    if(!file) return true;
    //const folderDate = dayjs().locale('se-kr').format('/YYYY/MM');
    let folderPath =  '/' + userId + "/";
    const existError = await nasCtrl.checkThenMakeFolder(folderPath, type = 'logo');
    if (existError) {
        throw 'error occured during access to nas';
    }

    file.filename = "logo";
    const uploadError = await nasCtrl.uploadFile(file , folderPath, type = 'logo');
    if (uploadError) {
        // 업로드 실패시 throw
        throw 'error occured put file to nas storage';
    }
    return true;
}


module.exports = {
    Add:userAdd,
    Modify:userModify,
    List:userList,
    Delete:userDelete,
    Get:userGet,
    Restrict:userRestrict,
    Verify:userVerify
}