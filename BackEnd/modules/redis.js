const redis = require("redis");

//환경변수 중 redis port를 자동으로 설정하나봄.
const redisClient = redis.createClient({
    url: "redis://redis-server:6379"
});

module.exports = redisClient;