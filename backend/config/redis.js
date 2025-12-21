import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

let isRedisConnected = false;

redisClient.on('error', (err) => {
    // Suppress connection refused errors to avoid console spam if redis is down
    if (err.code === 'ECONNREFUSED') {
        isRedisConnected = false;
    } else {
        console.log('Redis Client Error', err);
    }
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
    isRedisConnected = true;
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        return true;
    } catch (error) {
        console.log("Redis connection failed. Falling back to in-memory store.");
        return false;
    }
};

export { redisClient, connectRedis, isRedisConnected };
