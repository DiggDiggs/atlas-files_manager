// User Controllers for the application
const sha1 = require('sha1');
const { ObjectId } = ('mongodb');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
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

    try {
      await dbClient.connect();
      const userCollection = dbClient.collection('users');
      const existingUser = await userCollection.findOne({ email });

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
      email,
    });
  }

  // Retrieve user the token
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      console.log('Token not valid or undefined');
      return res.status(401).send({ error: 'Unauthorized' });
    }

    try {
      // Retrieve user from Redis cache based on token
      const userId = await redisClient.get(`auth_${token}`);
      console.log('userId from redisClient is:', userId);
      if (!userId) {
        console.log('No userId or invalid');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Retrieve user details from the database
      const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });

      if (!user) {
        console.log('User not found in the database');
        return res.status(401).send({ error: 'Unauthorized' });
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
