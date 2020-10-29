// review route
const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const Review = require('../models/review')
const Campground = require("../models/campground");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews')

// c route
router.post('/', isLoggedIn 
        , validateReview
        , catchAsync(reviews.createReview))

// d route
router.delete('/:reviewId',isLoggedIn 
        , isReviewAuthor
        , catchAsync(reviews.deleteReview))

module.exports = router;