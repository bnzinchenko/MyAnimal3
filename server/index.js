const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const clientAdminRoutes = require('./routes/clientAdmins');
const objectSchemaRoutes = require('./routes/objectSchemas');
const objectItemRoutes = require('./routes/objectItems');





dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database connected and synced.');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });

app.use('/api/', authRoutes);
app.use('/api/clientadmins', clientAdminRoutes);
app.use('/api/objectschemas', objectSchemaRoutes);
app.use('/api/objectitems', objectItemRoutes);


app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
