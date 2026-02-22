const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET ALL POSTS
router.get('/', authenticateToken, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
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

// CREATE POST
router.post('/', authenticateToken, async (req, res) => {
  const { content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        user_id: req.user.id,
        content: content
      }
    });
    res.json({ success: true, post });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// GET COMMENTS FOR POST
router.get('/:id/comments', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { post_id: parseInt(id) },
      include: {
        user: { select: { username: true, profile_color: true } }
      },
      orderBy: { created_at: 'asc' }
    });

    const formattedComments = comments.map(c => ({
      ...c,
      username: c.user.username,
      profile_color: c.user.profile_color
    }));

    res.json(formattedComments);
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// CREATE COMMENT
router.post('/comments', authenticateToken, async (req, res) => {
  const { post_id, comment_text } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        post_id: parseInt(post_id),
        user_id: req.user.id,
        comment_text
      }
    });
    res.json({ success: true, comment });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Protected route to delete a post (Fixes IDOR)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Post deleted securely' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
