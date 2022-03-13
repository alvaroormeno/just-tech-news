const User = require('./User');
const Post = require("./Post");



// create associations between USER TABLE and POST TABLE
User.hasMany(Post, {
    foreignKey: 'user_id'
});
Post.belongsTo(User, {
    foreignKey: 'user_id',
});








module.exports = { User, Post };