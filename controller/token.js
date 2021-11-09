const {sign,verify,refreshVerify} = require("../modules/jwt");
const getUserByUid = require("./nextrend/user.ctrl").getUserByUid;
const jwt = require("jsonwebtoken");


const getUser = async (req,res) => {
    if(req.headers.authorization){
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const userInfo = await verify(authToken);
        const data = await getUserByUid(userInfo.userID);
        if(data){
            res.send(data);
        }else{
            res.status(401).send();
        }
    }
}

const refresh = async (req,res) => {
    if(req.headers.authorization && req.headers.refresh){
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        // access 토큰 검증
        const authResult = verify(authToken);

        // token을 디코딩해서 정보를 가져온다.
        const decoded = jwt.decode(authToken);

        // 디코딩 결과 없을 시
        if (decoded===null){
            res.status(401).send({
                ok:false,
                message:'No authorized'
            });
        }

        /* access token을 검증하여 id를 가져와 검증함. */
        const refreshResult = refreshVerify(refreshToken,decoded.userID);

        //

    }
}

module.exports = {
    getUser:getUser,
    refresh:refresh
}