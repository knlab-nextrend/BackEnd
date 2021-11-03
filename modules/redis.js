const redis = require("redis");

//환경변수 중 redis port를 자동으로 설정하나봄.
const redisClient = redis.createClient(process.env.REDIS_PORT);

module.exports = redisClient;