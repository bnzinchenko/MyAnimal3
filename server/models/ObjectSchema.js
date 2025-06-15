module.exports = (sequelize, DataTypes) => {
    const ObjectSchema = sequelize.define('ObjectSchema', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fields: { // JSON array of fields
            type: DataTypes.JSONB, // Use JSONB for flexible schema
            allowNull: false,
            defaultValue: []
        },
        clientAdminId: {     //  <---- Добавлено поле clientAdminId
            type: DataTypes.INTEGER,
            allowNull: true  //  <---- Схема может быть не привязана к админу
        }
    });

    ObjectSchema.associate = (models) => {
        ObjectSchema.hasMany(models.ObjectItem, {
            foreignKey: {
                name: 'objectSchemaId',
                allowNull: false
            },
            as: 'ObjectItems'
        });
        ObjectSchema.belongsTo(models.ClientAdmin, { //  <---- Добавлена связь с ClientAdmin
            foreignKey: {
                name: 'clientAdminId',
                allowNull: true  //  <---- Схема может быть не привязана к админу
            },
            as: 'ClientAdmin'
        });
    };

    return ObjectSchema;
};