require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

// Set DATABASE_URL for Prisma if not already in env
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `postgresql://user:password@db:5432/pentest_db?schema=public`;
}

console.log('Using Database URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')); // Mask password

// Security Middleware
// Modified helmet for development/demo ease
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors()); // Allow all origins for the lab demo
app.use(express.json());

// Main Routes
app.use('/', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Secure Backend (PRISMA/BCRYPT) running on port ${PORT}`);
});
