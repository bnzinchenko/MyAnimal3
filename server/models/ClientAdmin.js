module.exports = (sequelize, DataTypes) => {
    const ClientAdmin = sequelize.define('ClientAdmin', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Name cannot be empty'
                }
            }
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    ClientAdmin.associate = (models) => {
        ClientAdmin.hasOne(models.User, {
            foreignKey: {
                name: 'clientAdminId',
                allowNull: false,
            },
            as: 'User',
        });
        ClientAdmin.hasMany(models.ObjectItem, { // Связь с ObjectItem
            foreignKey: {
                name: 'clientAdminId',
                allowNull: false,
            },
            as: 'ObjectItems',
        });

        ClientAdmin.hasMany(models.ObjectSchema, {  // <----  Добавляем связь с ObjectSchema
             foreignKey: {
                 name: 'clientAdminId',
                 allowNull: true  // Может не быть привязан
             },
             as: 'ObjectSchemas'
         });
    };

    return ClientAdmin;
};