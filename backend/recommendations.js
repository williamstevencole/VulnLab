/**
 * RECOMMENDATIONS TO PREVENT SQL INJECTION AND SECURE THE APP
 */

// 1. USE PARAMETERIZED QUERIES (The most important fix)
// Instead of: `SELECT * FROM users WHERE id = '${id}'`
// Use the 'pg' library's built-in parameterization:
const getUserSecurely = async (userId) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [userId];
    return await pool.query(query, values); // The library handles escaping
};

// 2. USE AN ORM (Object-Relational Mapper)
// Libraries like Sequelize or Prisma abstract SQL entirely.
// Example with Sequelize:
// const user = await User.findOne({ where: { username: req.body.username } });

// 3. ENABLE CORS (Cross-Origin Resource Sharing)
// Restrict which domains can talk to your API.
const cors = require('cors');
// app.use(cors({ origin: 'http://trusted-frontend.com' }));

// 4. USE SECURITY HEADERS (Helmet.js)
// Automatically sets headers to prevent common attacks like XSS.
const helmet = require('helmet');
// app.use(helmet());

// 5. INPUT VALIDATION (Joi or Zod)
// Ensure the data coming in is what you expect (e.g., email is actually an email).
// if (typeof username !== 'string' || username.length < 3) throw Error('Invalid input');

// 6. PASSWORD HASHING (Bcrypt)
// NEVER store passwords in plain text like this lab does.
// const hashedPassword = await bcrypt.hash(plainPassword, 10);

module.exports = { /* recommendations only */ };
