// Task 2. First API
const express = require('express');

const app = express();
// Load routes
const routes = require('./routes/index.js/index');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Middleware to use the routes
app.use(routes);

// Listen on port from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port 5000');
});

module.exports = app;
