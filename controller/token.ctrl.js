const {sign,verify,refreshVerify} = require("../modules/jwt");
const getUserByUid = require("../service/nextrend/user").getUserByUid;
const jwt = require("jsonwebtoken");


// header에 있는 토큰을 통해 유저 정보를 식별하고, 해당 유저의 정보를 반환.
// 토큰이 만료되었을 경우, refresh 쪽의 호출 필요.
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
    // access token과 refresh token의 존재 유무를 체크
    if(req.headers.authorization && req.headers.refresh){
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        // access 토큰 검증
        const authResult = await verify(authToken);

        // token을 디코딩해서 정보를 가져온다.
        const decoded = jwt.decode(authToken);

        // 디코딩 결과 없을 시
        if (decoded===null){
            res.status(401).send({
                ok:false,
                message:'No authorized'
            });
        }

        // 디코딩된 id를 가져와 refresh token을 검증함.
        const refreshResult = await refreshVerify(refreshToken,decoded.userID);

        // 재발급 절차 진입. (access token만 만료되었음을 확인)
        if(authResult.ok === false && authResult.message === 'jwt expired'){
            if(refreshResult === false){
                // 1.access 만료, refresh 만료 -> 다시 로그인
                res.status(401).send({
                    ok:false,
                    message:'No authorized'
                });
            }else{
                // 2. access 만료, refresh 유효 -> access 재발급.
                const newAccessToken = await sign(decoded);
                res.status(201).send({
                    ok:true,
                    token:newAccessToken,
                    refreshToken:refreshToken
                });
            }
        }else{
            // 3. 그럴 일은 없겠지만.. access가 만료되지 않았을 경우, 오히려 400 오류를 줌.
            res.status(400).send({
                ok:false,
                message:"Access Token not expired"
            })
        }
    }else{
        // 4. refresh 토큰 발급 요청에 refresh, access 토큰이 하나라도 없을 경우
        res.status(400).send({
            ok:false,
            message:"Access token and refresh token are need for refresh"
        })
    }
}

module.exports = {
    getUser:getUser,
    refresh:refresh
}