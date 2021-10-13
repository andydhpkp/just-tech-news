//the router instance in routes/index.js collected everything for us and packaged them up for server.js to use
const express = require('express')
const routes = require('./routes')
const sequelize = require('./config/connection')

const app = express()
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//turn on routes
app.use(routes)

//turn on connection to db and server
///the sync part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!
///force: false doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'))
})