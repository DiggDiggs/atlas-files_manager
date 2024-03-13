// import mongodb client
const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';

const url = `mongodb://${host}:${port}/${database}`;

class DBClient {
  // constructor to create client to MongoDB
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (client) {
        this.db = client.db(database);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      }
      if (error) {
        this.db = false;
        console.log(error);
      }
    });
  }

  isAlive() {
    if (!this.db) {
      return !!this.db;
    }
    return !!this.db;
  }

  async nbUsers() {
    const numDocs = await this.users.countDocuments({});
    return numDocs;
  }

  async nbFiles() {
    const numDocs = await this.files.countDocuments({});
    return numDocs;
  }
}

// export DBClient instance
const dbClient = new DBClient();
module.exports = dbClient;