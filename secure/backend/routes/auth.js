const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../db');
const rateLimit = require('express-rate-limit');

// Rate limiter for login: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if password matches via Bcrypt OR plain text (for demo seed data compatibility)
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      isMatch = (password === user.password);
    }

    if (!isMatch && password === user.password) {
      isMatch = true;
    }

    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '2h' }
      );

      const { password: _, ...userSafe } = user;
      res.json({ success: true, user: userSafe, token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Bad request or validation error' });
  }
});

module.exports = router;
