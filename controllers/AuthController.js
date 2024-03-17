// Controller for authentication
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid'; // generate unique id
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

// AuthController class
const AuthController = {
  getConnect: async (req, res) => {
    const authHeader = req.header('Authorization');
    console.log(authHeader);

    // Making sure the header is there
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extracting the Base64 encoded credentials from the Authorization header
    const encodedCredentials = authHeader.slice('Basic '.length);
    const credentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Hashing the password
    const hashedPassword = sha1(password);

    try {
      // console.log('about to get the user');
      const user = await dbClient.findUser({ email, password: hashedPassword });
      // console.log('the user is:', user);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generating a token
      const token = uuidv4();
      await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60); // set token valid for 24 hours

      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Getting disconnect
  getDisconnect: async (req, res) => {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const reply = await redisClient.del(`auth_${token}`);
      if (reply === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.status(204).send(); // Adjusted with return
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' }); // Adjusted with return
    }
  },
};

module.exports = AuthController;