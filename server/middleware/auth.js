const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json({ message: 'Token missing' });
        }
    } else {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
};

const authorizeRole = (allowedRoles) => (req, res, next) => {
    const role = req.headers['x-user-role'];
    if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
};

module.exports = { authenticateToken, authorizeRole };