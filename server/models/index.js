const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Отключаем логирование SQL-запросов
});

const models = {
    User: require('./User')(sequelize, Sequelize.DataTypes),
    ClientAdmin: require('./ClientAdmin')(sequelize, Sequelize.DataTypes), //  <---- Убедитесь, что передаете sequelize и Sequelize.DataTypes
    ObjectSchema: require('./ObjectSchema')(sequelize, Sequelize.DataTypes), //  <---- Убедитесь, что передаете sequelize и Sequelize.DataTypes
    ObjectItem: require('./ObjectItem')(sequelize, Sequelize.DataTypes),   //  <---- Убедитесь, что передаете sequelize и Sequelize.DataTypes
};

Object.values(models)
    .filter(model => typeof model.associate === "function")
    .forEach(model => model.associate(models));

const db = {
    ...models,
    sequelize,
    Sequelize,
};

module.exports = db;