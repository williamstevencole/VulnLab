const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// VULNERABLE LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log('SQL Executed:', query);
  try {
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SIGNUP
app.post('/signup', async (req, res) => {
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

// GET STATS
app.get('/stats', async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const postCount = await pool.query('SELECT COUNT(*) FROM posts');
    const commentCount = await pool.query('SELECT COUNT(*) FROM comments');
    res.json({
      totals: {
        users: userCount.rows[0].count,
        posts: postCount.rows[0].count,
        comments: commentCount.rows[0].count
      }
    });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// POSTS
app.get('/posts', async (req, res) => {
  try {
    const query = `
      SELECT posts.*, users.username, users.profile_color, COUNT(comments.id) as comment_count
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      LEFT JOIN comments ON comments.post_id = posts.id
      GROUP BY posts.id, users.username, users.profile_color
      ORDER BY posts.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/posts', async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *', 
      [user_id, content]
    );
    res.json({ success: true, post: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// COMMENTS
app.get('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'SELECT comments.*, users.username, users.profile_color FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = $1 ORDER BY created_at ASC', 
    [id]
  );
  res.json(result.rows);
});

app.post('/comments', async (req, res) => {
  const { post_id, user_id, comment_text } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *', 
      [post_id, user_id, comment_text]
    );
    res.json({ success: true, comment: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// USERS
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT id, username, email, role, profile_color FROM users');
  res.json(result.rows);
});

app.get('/users/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT posts.*, users.username, users.profile_color, COUNT(comments.id) as comment_count
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      LEFT JOIN comments ON comments.post_id = posts.id
      WHERE posts.user_id = $1
      GROUP BY posts.id, users.username, users.profile_color
      ORDER BY posts.created_at DESC
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
