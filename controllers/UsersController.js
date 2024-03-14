const express = require('express');
const sha1 = require('sha1');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

// User model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// POST /users
app.post('/users', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Already exist' });
  }

  const hashedPassword = sha1(password);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  return res.status(201).json({ id: newUser._id, email: newUser.email });
});

app.listen(3000, () => console.log('Server started on port 3000'));
