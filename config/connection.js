// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

//to make sure mySQL user info is not on github
///I did npm i dotenv and created .env first
require('dotenv').config();

//create connection to our database, pass in your MySQL information for username and password
//just_tech_news_db was already created in db/schema.sql
//https://sequelize.org/v5/manual/getting-started.html
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;