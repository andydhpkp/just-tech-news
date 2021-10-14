//This file will become more important as we create more models, but for now it'll just be for collection and exporting the User model data
const User = require('./User');
const Post = require('./Post')

//create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
})
//create the reverse association
Post.belongsTo(User, {
    foreignKey: 'user_id'
})

module.exports = { User, Post };