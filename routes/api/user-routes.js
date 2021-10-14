const router = require('express').Router();
const { User, Post, Vote } = require('../../models')

//GET /api/users
router.get('/', (req, res) => {
    //Access our User model and run .findAll() method
    ///.findAll() is one of the Sequelize Model class's methods that lets us query all of the users from the user table in the database, and is the JS equivalent of 'SELECT * FROM users;'
    User.findAll({
        //STORING A PASSWORD AS-S IN A DATABASE IS A BAD IDEA
        //excludes the password column, it is an array because if we want to exclude more than one, we can just add more
        attributes: { exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
});

//GET /api/users/1
router.get('/:id', (req, res) => {
    //documentation on model usage and querying: https://sequelize.org/v5/manual/models-usage.html#data-retrieval---finders  https://sequelize.org/v5/manual/querying.html
    //findONe() is another of the model class's methods
    User.findOne({
        attributes: { exclude: ['password']},
        //the where option to indicate we want to find a user where its id value equals whatever req.params.id is, much like 'SELECT * FROM users WHERE id = 1'
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' })
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

//POST /api/users
router.post('/', (req, res) => {
    //Sequelize's create() method passes in key/value paris where the keys are what we defined in the User model and the values are what we get from req.body, in SQL the command would be: 'INSERT INTO users (username, email, password) VALUES ("Lernantino, "lernantino@gmail.com", "password1234");'
    //expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

//POST route for login
router.post('/login', (req, res) => {
    //expects {email: 'lernantino@gmail.com', password: 'password1234'}
    //Queried the User table using the findOne() for the email entered by the user and assigned it to req.body.email
    /*
    The .findOne() Sequelize method looks for a user with the specified email. The result of the query is passed as dbUserData to the .then() part of the .findOne() method. 
    If the query result is successful (i.e., not empty), we can call .checkPassword(), which will be on the dbUserData object. We'll need to pass the plaintext password, which is stored in req.body.password, 
    into .checkPassword() as the argument.
    The .compareSync() method, which is inside the .checkPassword() method, can then confirm or deny that the supplied password matches the hashed password stored on the object. 
    .checkPassword() will then return true on success or false on failure. We'll store that boolean value to the variable validPassword.
    */
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address! '})
            return
        }
        //Verify user
        //the checkPassword() is added to the User.js
        const validPassword = dbUserData.checkPassword(req.body.password)
        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' })
            return
        }

        res.json({ user: dbUserData, message: 'You are now logged in!' })
    })
})

//PUT /api/users/1
router.put('/:id', (req, res) => {
    //expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    //This update() method combines the parameters for creating data and looking up data. We pass in req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used. SQL = 'UPDATE users SET username = "lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1;'
    //if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        //add this to check if the hook update is effective
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' })
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

//DELETE /api/users/1
router.delete('/:id', (req, res) => {
    //to delete data, use the destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table
    //link for creating, updating, and deleting data with Sequelize: https://sequelize.org/v5/manual/instances.html
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' })
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
});

module.exports = router;