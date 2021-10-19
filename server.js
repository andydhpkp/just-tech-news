//the router instance in routes/index.js collected everything for us and packaged them up for server.js to use
const path = require('path')
const sequelize = require('./config/connection')
const express = require('express')
//adding express-handlebars
const exphbs = require('express-handlebars')
//after downloading express-session and connect-session-sequelize
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const sess = {
    //should be replaced by an actual secret and stored in the .env file
    secret: 'Super secret secret',
    //any optional additions on the cookie are set within {}, but can be blank
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
}

const app = express()
const PORT = process.env.PORT || 3001;



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
//use session
app.use(session(sess))

//turn on routes
app.use(require('./controllers/')) 

//turn on connection to db and server
///the sync part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!
///force: false doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

