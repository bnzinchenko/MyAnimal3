const express = require('express');
const router = express.Router();
const { ObjectItem, ObjectSchema, ClientAdmin, User } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/objectitems/:id
router.get('/:id', authenticateToken, authorizeRole(['superadmin', 'clientadmin']), async (req, res) => {
    try {
        const { id } = req.params;
        const objectItem = await ObjectItem.findByPk(id);
        if (!objectItem) {
            return res.status(404).json({ message: 'Object item not found' });
        }
        res.json(objectItem);
    } catch (error) {
        console.error('Error getting object item:', error);
        res.status(500).json({ message: 'Error getting object item' });
    }
});

// GET /api/objectitems
router.get('/', authenticateToken, authorizeRole(['superadmin', 'clientadmin', 'operator']), async (req, res) => {
    try {
        const { schemaId } = req.query;
        const { role, userId, clientAdminId } = req.user;

        let whereClause = {};

        if (schemaId) {
            whereClause.objectSchemaId = schemaId;
        }

        if (role === 'clientadmin') {
            whereClause.clientAdminId = clientAdminId;
        } else if (role === 'operator') {
            const user = await User.findByPk(userId);
            if (!user || !user.clientAdminId) {
                return res.status(403).json({ message: 'Operator not belonging to any client admin' });
            }
            whereClause.clientAdminId = user.clientAdminId;
        }

        const objectItems = await ObjectItem.findAll({
            where: whereClause,
            include: [
                { model: ObjectSchema, as: 'ObjectSchema' },
                { model: ClientAdmin, as: 'ClientAdmin' }
            ]
        });

        res.json(objectItems);
    } catch (error) {
        console.error('Error getting object items:', error);
        res.status(500).json({ message: 'Error getting object items' });
    }
});

router.post('/', authenticateToken, authorizeRole(['clientadmin', 'operator']), async (req, res) => {
    try {
        const { objectSchemaId, data } = req.body;
        const { role, userId, clientAdminId } = req.user;

        const user = await User.findByPk(userId);
        if (!user || !user.clientAdminId) {
            return res.status(403).json({ message: 'Operator not belonging to any client admin' });
        }

        const objectSchema = await ObjectSchema.findByPk(objectSchemaId);
        if (!objectSchema) {
            return res.status(400).json({ message: 'Invalid objectSchemaId' });
        }

        // Basic Validation
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Invalid data. Data must be a non-empty object.' });
        }

        const newObjectItem = await ObjectItem.create({
            objectSchemaId,
            data,
            clientAdminId: user.clientAdminId,
        });

        res.status(201).json(newObjectItem);

    } catch (error) {
        console.error('Error creating object item:', error);
        res.status(500).json({ message: 'Error creating object item' });
    }
});

module.exports = router;