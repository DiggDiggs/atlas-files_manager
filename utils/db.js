const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';

const url = `mongodb://${host}:${port}/${database}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  async connect() {
    try {
      await this.client.connect();
      this.isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      this.isConnected = false;
      return this.isConnected;
    }
  }

  async isAlive() {
    try {
      await this.client.db('admin').command({ ping: 1 });
      return this.isConnected;
    } catch (error) {
      // if (error.message.includes('not authorized on admin to execute command { ping: 1 }')) {
      //   return false;
      // }
      console.error('Error checking MongoDB connection:', error);
      return this.isConnected;
    }
  }

  async nbUsers() {
    try {
      const collection = this.client.db().collection('users');
      return await collection.countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const collection = this.client.db().collection('files');
      return await collection.countDocuments();
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
dbClient.connect(); // Connect to MongoDB when the application starts

module.exports = dbClient;
