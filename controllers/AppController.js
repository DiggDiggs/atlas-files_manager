// Definition of 2 endpoints
const redisClient = require('../utils/redis');
const DBClient = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    const redisAlive = redisClient.isAlive();
    const dbAlive = DBClient.isAlive();
    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  static async getStats(req, res) {
    const users = await DBClient.nbUsers();
    const files = await DBClient.nbFiles();
    res.status(200).json({ users, files });
  }
}

module.exports = AppController;