//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
var _ = require('lodash');
const ejs = require("ejs");
const mongoose=require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM("/partial/header.ejs");
const $ = require('jquery')(dom.window);
var login_value=false;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate=require('mongoose-findorcreate');
const app = express();
app.use(session({
  secret:"this is secret",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb+srv://orderof3:Terrific%40trio@diethard.sjjzz.mongodb.net/Diet_Hard?retryWrites=true&w=majority");
const userSchema=new mongoose.Schema({
  name:String,
  email: String,
  password: String,
  googleId:String,
  state: String,
  height: Number,
  weight: Number,
  age: Number,
  gender: String,
  allergens: Array

});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// requires the model with Passport-Local Mongoose plugged in
const User = new mongoose.model("User",userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user,done){
  done(null,user.id);
});
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user)
  {
    done(err,user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/DietHard",
  //  userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},

function(accessToken, refreshToken, profile, cb) {
  console.log(profile);
  User.findOrCreate({ googleId: profile.id,name:profile.displayName, }, function (err, user) {
    return cb(err, user);
  });
}
));


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/auth/google",passport.authenticate('google',{scope:["profile"]}));
app.get('/auth/google/DietHard', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
app.get("/",function(req,res){
 
res.render("home",{login_value:req.isAuthenticated()});
});
app.get("/lessons",function(req,res){
  res.render("lessons",{login_value:req.isAuthenticated()});
  
});

app.get("/goal",function(req,res){
  if(req.isAuthenticated()){
    
    res.render("goal",{login_value:req.isAuthenticated()});
  }
  else{
    res.redirect("/");
  }    
  
  });


app.get("/profile",function(req,res){
    if(req.isAuthenticated()){
      
      res.render("profile",{name:req.user.name,weight:req.user.weight,height:req.user.height,age:req.user.age,email:req.user.username,state:req.user.state,gender:req.user.gender,allergens:req.user.allergens,login_value:req.isAuthenticated()});
    }
    else{
      res.redirect("/");
    }    
    
    });

app.post("/profile",function(req,res){
  console.log(req.body.gender);
    User.findOneAndUpdate({_id:req.user._id}, {name:req.body.name,weight:req.body.weight,height:req.body.height,age:req.body.age,email:req.body.username,state:req.body.state,gender:req.body.gender,allergens:req.body.allergens,username:req.body.username},{new:true}, function(err, doc) {
    if(err) return console.log(err);});
  // req.user.name=req.body.name;
   console.log(req.body.allergens);
   console.log(req.user.allergens);
res.redirect("/profile");

});
app.get("/tracker",function(req,res){
  if(req.isAuthenticated()){
    
    res.render("tracker",{login_value:req.isAuthenticated()});
  }
  else{
    res.redirect("/");
  }    
  
  });       

app.post("/register",function(req,res){
        
  User.register({name:req.body.name,weight:null,height:null,age:null,email:req.body.username,username:req.body.username,state:"",gender:"",allergens:[], active: false}, req.body.password, function(err, user) {
  if (err) { console.log(err);
  res.redirect("/");}
  else{
    passport.authenticate("local")(req,res,function(){
      
res.redirect("/profile");
});
}
});
});

app.post("/login",function(req,res){
const user=new User({
  username:req.body.username,
  password:req.body.password
});

req.login(user,function(err){
  if(err){
    console.log(err);
    }
    else{
      passport.authenticate("local")(req,res,function(){
        
        res.redirect("/profile");
      })
    }
})
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
