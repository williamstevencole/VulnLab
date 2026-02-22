const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET STATS
router.get('/stats', async (req, res) => {
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

// GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, profile_color FROM users');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET USER POSTS
router.get('/:id/posts', async (req, res) => {
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

module.exports = router;
