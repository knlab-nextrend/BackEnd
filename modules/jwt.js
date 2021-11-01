const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const secretKey = require("../configs/keys").secretKey;
const options = require("../configs/keys").option;
const {promisify} = require("util");
const redisClient = require("./redis");

const sign = async(user) =>{
    //payload 는 암호화 되지 않기에 password를 담지 않음.
    const payload = {
        userID:user.userID,
        Category:user.Category,
    };
    return jwt.sign(payload,secretKey,options);
}

const verify = async (token) => {
    let decoded;
    try{
        decoded = jwt.verify(token,secretKey);
        return {
            ok:true,
            userID:decoded.userID,
            Category:decoded.Category
        };
    }catch(err){
        return {
            ok: false,
            message: err.message,
          };
    }
} 

const refresh = () => {
    return jwt.sign({},secretKey,{
        algorithm:options.algorithm,
        expiresIn:'14d'
    });
}

const refreshVerify = async (token, userID) =>{
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
    const getAsync = promisify(redisClient.get).bind(redisClient);

    try{
        const data = await getAsync(userID);
        if (token === data){
            try{
                jwt.verify(token,secretKey);
                return true;
            }catch(err){
                return false;
            }
        }else{
            return false;
        }
    }catch(err){
        return false;
    }
}

module.exports = {
    sign:sign,
    verify:verify,
    refresh:refresh,
    refreshVerify:refreshVerify
}

