const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET ALL POSTS
router.get('/', async (req, res) => {
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

// CREATE POST
router.post('/', async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *', 
      [user_id, content]
    );
    res.json({ success: true, post: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET COMMENTS FOR POST
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT comments.*, users.username, users.profile_color FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = $1 ORDER BY created_at ASC', 
      [id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// CREATE COMMENT
router.post('/comments', async (req, res) => {
  const { post_id, user_id, comment_text } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *', 
      [post_id, user_id, comment_text]
    );
    res.json({ success: true, comment: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
