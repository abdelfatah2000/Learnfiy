const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const logger = require('../config/logger');

require('dotenv').config();

const maxConsecutiveFailsByEmailAndIP = 10;


const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

redisClient.connect();

redisClient.on('connect', () => {
  logger.info('Connected to Redis!');
});

redisClient.on('error', (err) => {
  logger.error(err);
});

exports.limiterConsecutiveFailsByEmailAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_ip_and_email',
  points: maxConsecutiveFailsByEmailAndIP,
  duration: 60 * 60, // Delete the key after 1 hour
  blockDuration: 60 * 60, // Block for 1 hour after 10 request
});


