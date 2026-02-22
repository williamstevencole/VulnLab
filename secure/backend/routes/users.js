const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET STATS
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    const commentCount = await prisma.comment.count();
    
    res.json({
      totals: {
        users: userCount,
        posts: postCount,
        comments: commentCount
      }
    });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ success: false, error: err.message }); 
  }
});

// GET ALL USERS
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, profile_color: true }
    });
    res.json(users);
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET USER POSTS
router.get('/:id/posts', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await prisma.post.findMany({
      where: { user_id: parseInt(id) },
      include: {
        user: { select: { username: true, profile_color: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const formattedPosts = posts.map(p => ({
      ...p,
      username: p.user.username,
      profile_color: p.user.profile_color,
      comment_count: p._count.comments
    }));

    res.json(formattedPosts);
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
