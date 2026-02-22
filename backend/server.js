const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/', authRoutes); // Login & Signup
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Vulnerable Backend running on port ${PORT}`);
});
