// User Controllers for the application
import redisClient from '../utils/redis';
import crypto from 'crypto';
import dbClient from '../utils/db';
// import crypto for password hashing

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password with SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Create the new user
    const newUser = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });
    
        // Return the new user's email and id
        return res.status(201).json({
          id: newUser.insertedId,
          email
        });
  }
    
  // Retrieve the user base on the token
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Get user ID string associated w/ token from Redis
      const userIdString = await RedisClient.get(`auth_${token}`);
      if (!userIdString) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Convert user ID string to MongoDB's ObjectID
      const userId = new ObjectID(userIdString);
      // Find user by ID from db
      const user = await dbClient.users.findOne({ _id: userId });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Return users ID and email, converting it from ObjectID to string for response
      return res.status(200).json({ id: user._id.toString(), email: user.email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    // Extract token from request headers
    const token = req.headers['x-token'];
    console.log("Token for getMe is:", token);

    // Check if token is present
    if (!token) {
      console.log("Token not valid or undefined");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Retrieve user from Redis cache based on token
      const userId = await redisClient.get(`auth_${token}`);
      console.log("userId from redisClient is:", userId);
      if (!userId) {
        console.log("No userId or invalid");
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Retrieve user details from the database
      const user = await dbClient.db.collection('users').findOne({ _id: userId });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Return user email and id
      return res.status(200).json({ email: user.email, id: user._id });
    } catch (error) {
      console.error('Error retrieving user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;