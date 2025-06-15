const express = require('express');
const router = express.Router();
const { ObjectSchema, ClientAdmin } = require('../models'); //  <---- Импортируем ClientAdmin
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/objectschemas - Получение списка схем объектов
router.get('/', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const objectSchemas = await ObjectSchema.findAll({
            include: [{
                model: ClientAdmin,
                as: 'ClientAdmin'
            }]
        }); // Получаем схемы объектов с информацией о ClientAdmin
        res.json(objectSchemas);
    } catch (error) {
        console.error('Error getting object schemas:', error);
        res.status(500).json({ message: 'Error getting object schemas' });
    }
});

// GET /api/objectschemas/:id - Получение схемы объекта по ID
router.get('/', authenticateToken, authorizeRole(['superadmin', 'clientadmin']), async (req, res) => {
    try {
        const { role, userId, clientAdminId } = req.user;

        let whereClause = {};

        if (role === 'clientadmin') {
            whereClause.clientAdminId = clientAdminId;
        }

        const objectSchemas = await ObjectSchema.findAll({
            where: whereClause,
            include: [{
                model: ClientAdmin,
                as: 'ClientAdmin'
            }]
        }); // Получаем схемы объектов с информацией о ClientAdmin
        res.json(objectSchemas);
    } catch (error) {
        console.error('Error getting object schemas:', error);
        res.status(500).json({ message: 'Error getting object schemas' });
    }
});

// POST /api/objectschemas - Создание новой схемы объекта
router.post('/', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { name, description, fields, clientAdminId } = req.body; // Добавляем clientAdminId
        const objectSchema = await ObjectSchema.create({ name, description, fields, clientAdminId }); // Добавляем clientAdminId
        res.status(201).json(objectSchema);
    } catch (error) {
        console.error('Error creating object schema:', error);
        res.status(500).json({ message: 'Error creating object schema' });
    }
});

// PUT /api/objectschemas/:id - Обновление схемы объекта
router.put('/:id', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, fields, clientAdminId } = req.body; // Добавляем clientAdminId

        const objectSchema = await ObjectSchema.findByPk(id);
        if (!objectSchema) {
            return res.status(404).json({ message: 'Object schema not found' });
        }

        objectSchema.name = name;
        objectSchema.description = description;
        objectSchema.fields = fields;
        objectSchema.clientAdminId = clientAdminId; // Добавляем clientAdminId
        await objectSchema.save();

        res.json(objectSchema);
    } catch (error) {
        console.error('Error updating object schema:', error);
        res.status(500).json({ message: 'Error updating object schema' });
    }
});

// DELETE /api/objectschemas/:id - Удаление схемы объекта
router.delete('/:id', authenticateToken, authorizeRole(['superadmin']), async (req, res) => {
    try {
        const { id } = req.params;
        const objectSchema = await ObjectSchema.findByPk(id);
        if (!objectSchema) {
            return res.status(404).json({ message: 'Object schema not found' });
        }
        await objectSchema.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting object schema:', error);
        res.status(500).json({ message: 'Error deleting object schema' });
    }
});

module.exports = router;