const router = require('express').Router()
//We include the User model for the post-routes because we would like to retrieve not only the post but the user who posted it
const { Post, User } = require('../../models')

//get all users
router.get('/', (req, res) => {
    console.log('=================')
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
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
      attributes: ['id', 'post_url', 'title', 'created_at'],
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
  

module.exports = router