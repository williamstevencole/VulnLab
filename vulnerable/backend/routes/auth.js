const express = require('express');
const router = express.Router();
const pool = require('../db');

// INTENTIONALLY VULNERABLE: String concatenation for SQLi demo
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  console.log('SQL Executed (Vulnerable Login):', query);
  
  try {
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(501).json({ success: false, message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Signup (also vulnerable or simple)
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const colors = ['#1d9bf0', '#f4212e', '#ffad1f', '#17bf63', '#794bc4', '#e0245e'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, email, profile_color) VALUES ($1, $2, $3, $4) RETURNING *', 
      [username, password, email, randomColor]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
