module.exports = (sequelize, DataTypes) => { // <---- Добавлено DataTypes
    const ObjectItem = sequelize.define('ObjectItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    });

    ObjectItem.associate = (models) => {
        ObjectItem.belongsTo(models.ClientAdmin, {
            foreignKey: {
                name: 'clientAdminId',
                allowNull: false,
            },
            as: 'ClientAdmin',
        });

        ObjectItem.belongsTo(models.ObjectSchema, {
            foreignKey: {
                name: 'objectSchemaId',
                allowNull: false,
            },
            as: 'ObjectSchema',
        });
    };
    return ObjectItem;
};