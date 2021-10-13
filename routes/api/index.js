//this file is a means to collect all of the API routes and package them up for us
const router = require('express').Router()

const userRoutes = require('./user-routes')

router.use('/users', userRoutes)

module.exports = router