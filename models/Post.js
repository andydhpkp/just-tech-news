const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection')

//Create our Post model
class Post extends Model {

}

//create fields/columns for Post model (more in depth in User.js)
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //the module used isURL, but it auto corrected to this
                isUrl: true
            }
        }, 
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
)

module.exports = Post