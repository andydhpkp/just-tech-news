//this is our first models foray https://sequelize.org/v5/manual/models-definition.html
///the model class in Sequelize allows us to create our own JS class and define the columns, data types, and any other rules we need the data to adhere to for SQL
const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection')
//npm i bcrypt for password hash https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt')

//create our User model
///we import the model class and DataTypes object from Sequelize. This model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has
class User extends Model {}

//define table columns and configuration 
//the init() method initializes the model's data and configuration passing in two objects as arguments
///the first object will define columns and data types for those columns
///the second object configures certain options for the table: https://sequelize.org/v5/manual/models-definition.html#configuration
User.init(
    {
        //TABLE COLUMN DEFINITIONS GO HERE column settings: https://sequelize.org/v5/manual/models-definition.html options for DataTypes: https://sequelize.org/v5/manual/data-types.html
        //define an id column
        id: {
            //use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            //instruct that this is the primary key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        //use hooks from Sequelize to create hashed password
        hooks: {
            //set up beforeCreate lifecycle "hook" functionality
            //userData and newUserData are two created local variables for pre-hash and post-hash data
            async beforeCreate(userData) {
                //the second parameter is the saltRounds parameter is known as the cost factor and controls how many rounds of hashing are done by the bcrypt algorithm
                newUserData.password = await bcrypt.hash(userData.password, 10)
                return newUserData
            }
        },
        //TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        //don't pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-casing
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;