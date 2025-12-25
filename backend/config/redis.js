import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1, // Don't hang if Redis is down
    retryStrategy: (times) => {
        if (times > 3) {
            console.warn('Redis connection failed. Running without cache.');
            return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
    }
});

redisClient.on('connect', () => {
    console.log('----Redis Connected Successfully----');
});

redisClient.on('error', (err) => {
    // Suppress error spam if Redis is not running
    if (err.code === 'ECONNREFUSED') {
        // Only log once or quietly
    } else {
        console.error('Redis Error:', err.message);
    }
});

export default redisClient;
