module.exports = {
    secretKey : 'YoU1r2S3eCrEtKeY1234', // 원하는 시크릿 키
    option : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "3h",  // 토큰 유효 기간
        issuer : "issuer", // 발행자
    },
    refreshExpiresIn : "7d"
}