// User Controllers for the application
import redisClient from '../utils/redis';
import crypto from 'crypto';
import dbClient from '../utils/db';
// import crypto for password hashing

class UsersController {
  static async postNew(req, res) {
    // Your postNew method implementation
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    console.log("Token for getMe is:", token);

    if (!token) {
      console.log("Token not valid or undefined");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);
      console.log("userId from redisClient is:", userId);
      if (!userId) {
        console.log("No userId or invalid");
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await dbClient.db.collection('users').findOne({ _id: userId });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(200).json({ email: user.email, id: user._id });
    } catch (error) {
      console.error('Error retrieving user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
