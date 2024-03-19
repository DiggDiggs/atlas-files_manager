// Controller for authentication
const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid'); // generate unique id
// import dbClient from '../utils/db';
const redisClient = require('../utils/redis');

// AuthController class
class AuthController  {
  static async getConnect (req, res) {
    try {
      const authHeader = req.header('Authorization');
      console.log(authHeader);

      // Making sure the header is there
      if (!authHeader || !authHeader.startsWith('Basic')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Extracting the Base64 encoded credentials from the Authorization header
      const encodedCredentials = authHeader.split(' '.length);
      const credentials = Buffer.from(encodedCredentials, 'base64').toString();
      const [email, password] = credentials.split(':');
      const user = await this.dbClient.getUser(email);

      if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!user || user.password !== sha1(password)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Generate token
      const token = uuidv4();
      const key = `auth_${token}`;

      // Store user ID in Redis for 24 hours
      await redisClient.set(key, user._id, 'EX', 86400);

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Getting disconnect
  static async getDisconnect (req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).send('Unauthorized');
    
    await redisClient.del(key);
    
    res.status(204).send();
  }
};

module.exports = AuthController;
