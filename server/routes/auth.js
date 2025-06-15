const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// POST /api/login - Аутентификация пользователя
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and assign a token
        const token = jwt.sign({
            userId: user.id,
            role: user.role,
            clientAdminId: user.clientAdminId
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role, username: user.username }); // Added username
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

module.exports = router;