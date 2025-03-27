require('dotenv').config();
const express =require('express');
const app= express();
const session= require('express-session');
const cors= require('cors');
const passport=require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sessionConfig=require('./src/config/sessionConfig.js');
const passportSetup = require('./src/config/passport.js');  // always important to require this file while working with google authentication 
const connectDB=require('./src/config/dbConfig.js');
const authRoute=require('./src/routes/authRoutes.js');
const User = require('./src/models/user');
const PORT=8080;
const flash = require('connect-flash');
connectDB();
// app.set('trust proxy',1);  // enable during production 
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

app.use(express.json()); // used to parse JSON data
app.use(express.urlencoded({extended:true})); // used to parse data from the URL
app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize()); //Initializes Passport.js for authentication.
app.use(passport.session()); // Enables session-based authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/auth",authRoute);

app.get('/home',(req,res)=>{
    res.send('On Home Route');
})

app.listen(PORT,()=>{
    console.log(`Listening To Port ${PORT}`);
})