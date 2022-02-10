//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
var _ = require('lodash');
const ejs = require("ejs");
const mongoose=require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

``

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
  password: String
});

userSchema.plugin(passportLocalMongoose);
// requires the model with Passport-Local Mongoose plugged in
const User = new mongoose.model("User",userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
res.render("home");
});
app.get("/lessons",function(req,res){
  res.render("lessons");
  
});

app.get("/goal",function(req,res){
  res.render("goal");
  
});


app.get("/profile",function(req,res){
    if(req.isAuthenticated()){
      console.log(User.name);
      res.render("profile",{name:User.name});
    }
    else{
      res.redirect("/");
    }    
    
    });
        
app.get("/tracker",function(req,res){
  res.render("tracker");
});

app.post("/register",function(req,res){
        
User.register({name:req.body.name, username:req.body.username, active: false}, req.body.password, function(err, user) {
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
