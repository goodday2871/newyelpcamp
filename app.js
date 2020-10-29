if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

// import npm
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize')
const User = require('./models/user')
const helmet = require('helmet')
const MongoDBStore = require('connect-mongo')(session);
//Error function
const ExpressError= require("./utils/ExpressError");

//router
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/user')
//database config
const dbUrl = process.env.DB_URL  || 'mongodb://localhost/newYelpcamp'
//dbUrl
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify:false
});
const db =mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", ()=>{
    console.log("Database connect")
});
//express config with path
app.engine("ejs", ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())
//session config

const secret = process.env.SECRET || "thisisthetestsecretcode"

const store = new MongoDBStore({
    url:dbUrl,
    secret:secret,
    touchAfter:24*60*60
})
store.on("error", function(e){
    console.log("SESSION ERROR:",e)
})



const sessionConfig = {
    store,
    name:'cake',
    secret:secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000 * 60 *60 * 24 *7 ,
        maxAge:1000*60*60*24*7,
    }
}
app.use(session(sessionConfig))

//flash
app.use(flash())
app.use(helmet())

//helmet config
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhtvvcbec/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals config
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

//route

app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)
app.use('/', usersRoutes)





app.get('/', (req, res)=>{
    res.render('home')
});


//error route

app.all('*', (req, res, next)=>{
    next(new ExpressError("Page not found", 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = "OH NO Something got wrong.We will fixed it soon"    
    } 
    res.status(statusCode).render('error',{err})
})
const port = process.env.PORT || 5500

//listener
app.listen(port,()=>{
    console.log(`Severing on port ${port}`)
})