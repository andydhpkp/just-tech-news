const router = require('express').Router()
//We include the User model for the post-routes because we would like to retrieve not only the post but the user who posted it
const { User, Post, Vote } = require("../../models");
//in order to call Sequelize functionality with the upvote route
const sequelize = require('../../config/connection')

//get all users
router.get('/', (req, res) => {
    console.log('=================')
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        //order the results numerically
        order: [['created_at', 'DESC']],
        //This is how we JOIN the table
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

//get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
    res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//post route
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    }).then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

/* FOR REFACTORING, THIS ESSENTIALLY WAS MOVED TO THE POST MODEL, BUT THE COMMENTS WOULD GET FUCKED UP 
//PUT api/posts/upvote
//This will involve two queries: 1, using the Vote model to create a vote, 2 then querying on that post to get an updated vote count
//IMPORTANT: Because we've updated the relationships between the tables, we need to use sequelize.sync({ force: true }) in server.js, but change it back once updated
router.put('/upvote', (req, res) => {
    //create a vote
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    }).then(() => {
        //then find the post we just voted on
        return Post.findOne({
            where: {
                id: req.body.post_id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'created_at',
                //use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
                [
                    //Why we had to import the sequelize connection at the top
                    //literal() allows us to run regular SQL queries from within the Sequelize method-based queries
                    sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                    'vote_count'
                ]
            ]
        }).then(dbPostData => res.json(dbPostData))
        .catch(err => res.json(err))
    })
}) */
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

//put route
router.put('/:id', (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete route
router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router