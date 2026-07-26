const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

// Enable CORS for Vercel frontend requests
app.use(cors({ origin: '*' }));
app.use(express.json());

// Healthcheck route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'DenTrack JSON API Backend Server running for Render deployment',
    endpoints: {
      users: '/api/users'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/users - Return list of users
app.get('/api/users', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.status(404).json({ error: 'users.json database file not found' });
  } catch (err) {
    console.error('Error reading users database:', err);
    return res.status(500).json({ error: 'Server error reading users database' });
  }
});

// POST /api/users - Add a new user
app.post('/api/users', (req, res) => {
  try {
    const newUser = req.body;
    if (!newUser || !newUser.email || !newUser.role) {
      return res.status(400).json({ error: 'Invalid user data provided' });
    }

    let users = [];
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      users = JSON.parse(data);
    }

    users.push(newUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

    return res.json({ success: true, user: newUser });
  } catch (err) {
    console.error('Error writing to users database:', err);
    return res.status(500).json({ error: 'Server error updating users database' });
  }
});

app.listen(PORT, () => {
  console.log(`DenTrack Backend API server listening on port ${PORT}`);
});
