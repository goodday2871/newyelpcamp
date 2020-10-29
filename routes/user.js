const express = require('express')
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const users = require('../controllers/user')

router.route('/register')
    //c page
    .get(users.registerForm)
    //c route
    .post(catchAsync(users.createUser))

router.route('/login')
    //login page
    .get(users.loginForm)
    //login route
    .post( passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'})
        , users.login)


//logout route
router.get('/logout', users.logout)

module.exports = router