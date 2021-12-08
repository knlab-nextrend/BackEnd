const jwt = require("../modules/jwt");

const authJWT = async (req,res,next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split('Bearer ')[1]; //header에서 token을 가져옴.
        const result = await jwt.verify(token);
        if(result.ok){
            // token 검증 완료 시, req 에 값을 세팅한 후 콜백함수로 진행..
            req.userID = result.userID;
            req.Category = result.Category;
            res.set({
                userID:result.userID,
                Category:result.Category
            })
            next();
        }else{
            res.status(401).send({
                ok:false,
                message:result.message
            })
        }
    }else{
        res.status(401).send({
            ok:false,
            message:"There is no access token in header"
        })
    }
}

module.exports = authJWT;