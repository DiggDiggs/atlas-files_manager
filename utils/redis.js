const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
    });

    this.client.on('error', (err) => console.error(err));

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    return this.setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    return this.delAsync(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
