const express = require('express');
const router = express.Router();
const { ClientAdmin, User, ObjectSchema } = require('../models'); // <---- Подключаем ObjectSchema
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// GET /api/clientadmins - Получение списка клиентских администраторов
router.get('/', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const clientAdmins = await ClientAdmin.findAll({
            include: [{
                model: ObjectSchema,
                as: 'ObjectSchemas' //  <----  Указываем alias для связи
            }]
        });
        res.json(clientAdmins);
    } catch (error) {
        console.error('Error getting client admins list:', error);
        res.status(500).json({ message: 'Error getting client admins list' });
    }
});

// GET /api/clientadmins/:id - Получение информации о конкретном клиентском администраторе
router.get('/:id', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { id } = req.params;
        const clientAdmin = await ClientAdmin.findByPk(id, {
            include: [{
                model: ObjectSchema,
                as: 'ObjectSchemas'
            }]
        });

        if (!clientAdmin) {
            return res.status(404).json({ message: 'Client admin not found' });
        }

        res.json(clientAdmin);
    } catch (error) {
        console.error('Error getting client admin info:', error);
        res.status(500).json({ message: 'Error getting client admin info' });
    }
});


// POST /api/clientadmins - Создание нового клиентского администратора
router.post('/', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { name, initialPassword, organization } = req.body;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(initialPassword, salt);

        // Create the ClientAdmin record
        const clientAdmin = await ClientAdmin.create({
            name,
            organization,
        });

        // Create the User record associated with the ClientAdmin
        const user = await User.create({
            username: name, // Or you can generate a unique username
            password: hashedPassword,
            role: 'clientadmin',
            clientAdminId: clientAdmin.id,
        });

        res.status(201).json(clientAdmin);
    } catch (error) {
        console.error('Error adding client admin:', error);
        res.status(500).json({ message: 'Error adding client admin' });
    }
});

// PUT /api/clientadmins/:id - Обновление информации о клиентском администраторе
router.put('/:id', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, organization } = req.body;

        const clientAdmin = await ClientAdmin.findByPk(id);

        if (!clientAdmin) {
            return res.status(404).json({ message: 'Client admin not found' });
        }

        clientAdmin.name = name;
        clientAdmin.organization = organization;

        await clientAdmin.save();

        res.json(clientAdmin);
    } catch (error) {
        console.error('Error updating client admin:', error);
        res.status(500).json({ message: 'Error updating client admin' });
    }
});

// DELETE /api/clientadmins/:id - Удаление клиентского администратора
router.delete('/:id', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { id } = req.params;

        const clientAdmin = await ClientAdmin.findByPk(id);

        if (!clientAdmin) {
            return res.status(404).json({ message: 'Client admin not found' });
        }

        await clientAdmin.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting client admin:', error);
        res.status(500).json({ message: 'Error deleting client admin' });
    }
});

// POST /api/clientadmins/:id/reset-password - Сброс пароля клиентского администратора
router.post('/:id/reset-password', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const clientAdmin = await ClientAdmin.findByPk(id);

        if (!clientAdmin) {
            return res.status(404).json({ message: 'Client admin not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Find the corresponding User record
        const user = await User.findOne({ where: { clientAdminId: id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found for this client admin' });
        }

        // Update the password in the User record
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router;