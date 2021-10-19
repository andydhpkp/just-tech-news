//the router instance in routes/index.js collected everything for us and packaged them up for server.js to use
const path = require('path')
const express = require('express')
//adding express-handlebars
const exphbs = require('express-handlebars')

const app = express()
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection')

//add the style sheet
const hbs = exphbs.create({})
//after this is set up, create the views folder, layout, and the main.handlebars file
//this combines with exphbs and hbs
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
//add the style sheet
app.use(express.static(path.join(__dirname, 'public')))

//turn on routes
app.use(require('./controllers/')) 

//turn on connection to db and server
///the sync part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!
///force: false doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

