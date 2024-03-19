import { MongoClient } from 'mongodb';

// MongoDB connection
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const database = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    // MongoDB string
    this.dbUrl = `mongodb://${host}:${port}`;
    this.dbName = database;
    this.client = new MongoClient(this.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Connecting to MongoDB
    this.client.connect((err) => {
      if (err) {
        console.error('Failed to connect to MongoDB', err);
        return;
      }
      console.log('Connected to MongoDB');
      this.db = this.client.db(this.dbName);
    });
  }

  // Check if the connection is alive
  isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
  }

  // Getting number of users
  async nbUsers() {
    if (this.db) {
      return this.db.collection('users').countDocuments();
    }
    throw new Error('DB is not initialized.');
  }

  // Get the number of files
  async nbFiles() {
    if (this.db) {
      return this.db.collection('files').countDocuments();
    }
    throw new Error('DB is not initialized.');
  }

  // Find the user and return it
  async findUser(filter) {
    try {
      const user = await this.db.collection('users').findOne(filter);
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Failed to find user in database.');
    }
  }
}

// Export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;