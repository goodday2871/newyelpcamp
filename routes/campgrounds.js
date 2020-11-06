const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {isLoggedIn, isAuthor, validateCampground,detectIos} = require('../middleware')
const ExpressError = require('../utils/ExpressError');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    // index
    .get(catchAsync(campgrounds.index))
    //c route
    .post(isLoggedIn, upload.array('image',3), validateCampground, catchAsync(campgrounds.createCampground));

 
    //c page
 router.get('/new', isLoggedIn, campgrounds.newForm);


router.route('/:id')
    //r route
    .get(catchAsync(campgrounds.showCampground))
    //u route
    .put(isLoggedIn
        , isAuthor
        ,upload.array('image')
        , validateCampground
        , catchAsync(campgrounds.updateCampground))
    //d route
    .delete(isLoggedIn
        , isAuthor
        , catchAsync(campgrounds.deleteCampground));

    //u page
router.get('/:id/edit', isLoggedIn
        , isAuthor 
        , catchAsync(campgrounds.editForm));



 module.exports = router