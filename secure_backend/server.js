require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

// Security Middleware
app.use(helmet()); // Sets various security-related HTTP headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // Configures CORS
app.use(express.json());

// Main Routes
app.use('/', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Secure Backend (PRISMA/BCRYPT) running on port ${PORT}`);
});
