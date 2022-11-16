const redis = require("redis");

//환경변수 중 redis port를 자동으로 설정하나봄.
<<<<<<< HEAD
const redisClient = redis.createClient(process.env.REDIS_PORT);
=======
const redisClient = redis.createClient({
    url: "redis://localhost:6379"
});
>>>>>>> 4eb73263aa397f263d894e5d2b35198f54b3df69

module.exports = redisClient;