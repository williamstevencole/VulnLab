const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Protected route to delete a post (Fixes IDOR)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Fetch the post first
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // 2. IDOR FIX: Check if the user ID from JWT matches the post owner ID
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
