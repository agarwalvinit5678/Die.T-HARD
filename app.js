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
const regionalFoodItems=require("./RegionalFoods.js");
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
  cuisine: String,
  height: Number,
  weight: Number,
  age: Number,
  gender: String,
  allergens: Array,
  bmr:Number,
  pdct:Number,
  activitylevel: String,
  goal:String,
  split:String,
  protein:Number,
  carbohydrate:Number,
  fat:Number,

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
    
    res.render("goal",{login_value:req.isAuthenticated(),protein:req.user.protein,carbohydrate:req.user.carbohydrate,fat:req.user.fat});
  }
  else{
    res.redirect("/");
  }    
  
  });


app.get("/profile",function(req,res){
    if(req.isAuthenticated()){
      
      res.render("profile",{goal:req.user.goal,split:req.user.split,name:req.user.name,weight:req.user.weight,height:req.user.height,age:req.user.age,email:req.user.username,cuisine:req.user.cuisine,gender:req.user.gender,allergens:req.user.allergens,activitylevel:req.user.activitylevel,login_value:req.isAuthenticated()});
    }
    else{
      res.redirect("/");
    }    
    
    });

app.get("/diary",function(req,res){
    if(req.isAuthenticated()){
        
      res.render("diary",{login_value:req.isAuthenticated()});
    }
    else{
      res.redirect("/");
    }    
      
    });
  
app.post("/profile",function(req,res){
  console.log(req.body.gender);
 
  if(req.body.allergens==undefined)
  var allerging=[];
  else 
  var allerging=req.body.allergens;
  var Bmr=0;
  if(req.user.gender=="M")
  {
    Bmr=88.262+(13.397*req.user.weight)+(4.799*req.user.height)-(5.677*req.user.age);
  }
  else
  {
     Bmr=447.593+(9.247*req.user.weight)+(3.098*req.user.height)-(4.330*req.user.age);
  }

  if(req.body.activitylevel=="sedentary")
  var activitymultiplier=1.200;
  else if(req.body.activitylevel=="lightlyactive")
  var activitymultiplier=1.375;
  else if(req.body.activitylevel=="moderatelyactive")
  var activitymultiplier=1.550;
  else if(req.body.activitylevel=="veryactive")
  var activitymultiplier=1.725;
  else if(req.body.activitylevel=="extraactive")
  var activitymultiplier=1.900;

  if(req.body.goal=="retain")
  var goalscenario=1.000;
  else if(req.body.goal=="gain")
  var goalscenario=1.100;
  else if(req.body.goal=="lose")
  var goalscenario=0.900;
  var Pdct=parseInt((Bmr*activitymultiplier)*goalscenario);
  if(req.body.split=="standard")
  {var Protein = Pdct * 0.25;
  var Carbohydrate = Pdct * 0.45;
  var Fat = Pdct * 0.30;}
  else if(req.body.split=="protein")
  {var Protein = Pdct * 0.40;
  var Carbohydrate = Pdct * 0.35;
  var Fat = Pdct * 0.25;}
  else if(req.body.split=="carbohydrate")
  {var Protein = Pdct * 0.35;
  var Carbohydrate = Pdct * 0.10;
  var Fat = Pdct * 0.55;}
  User.findOneAndUpdate({_id:req.user._id}, {split:req.body.split,goal:req.body.goal,name:req.body.name,activitylevel:req.body.activitylevel,weight:req.body.weight,height:req.body.height,age:req.body.age,email:req.body.username,cuisine:req.body.cuisine,gender:req.body.gender,allergens:allerging,username:req.body.username, bmr:Bmr,pdct:Pdct,protein:Protein,carbohydrate:Carbohydrate,fat:Fat},{new:true}, function(err, doc) {
    if(err) return console.log(err);});
  // req.user.name=req.body.name;
  
  //console.log(bmr);
   //console.log(req.body.allergens);
   console.log(res.user);
res.redirect("/profile");

});
app.get("/tracker",function(req,res){
  if(req.isAuthenticated()){
    var Bprotein=parseInt(req.user.protein*0.25);
    var Bcarbohydrate=parseInt(req.user.carbohydrate*0.25);
    var Bfat=parseInt(req.user.fat*0.25);
    var Lprotein=parseInt(req.user.protein*0.35);
    var Lcarbohydrate=parseInt(req.user.carbohydrate*0.35);
    var Lfat=parseInt(req.user.fat*0.35);
    var Dprotein=parseInt(req.user.protein*0.40);
    var Dcarbohydrate=parseInt(req.user.carbohydrate*0.40);
    var Dfat=parseInt(req.user.fat*0.40);
    var Bcal=parseInt(req.user.pdct*0.25);
    var Lcal=parseInt(req.user.pdct*0.35);
    var Dcal=parseInt(req.user.pdct*0.40);
    var cuisinename=req.user.cuisine;
    //console.log(regionalFoodItems[cuisinename]);
    var foodobj=regionalFoodItems[cuisinename];
    var nonbreadobj=foodobj["nonBread"];
    var breadobj=foodobj["breads"];
    var nonbreadlength = Object.keys(nonbreadobj).length;
    var bbreadlength = Object.keys(breadobj).length;
   // console.log(nonbreadlength);
    var bnon= Math.floor(Math.random() * nonbreadlength);    
    var bbread= Math.floor(Math.random() * bbreadlength);
    var lnon= Math.floor(Math.random() * nonbreadlength);
    var lbread= Math.floor(Math.random() * bbreadlength);
    var dnon= Math.floor(Math.random() * nonbreadlength);
    var dbread= Math.floor(Math.random() * bbreadlength);
    var bbreaddish=Object.keys(breadobj)[bbread];
    console.log(breadobj[bbreaddish].calories);
    var bnondish=Object.keys(nonbreadobj)[bnon];
    var lbreaddish=Object.keys(breadobj)[lbread];
    var lnondish=Object.keys(nonbreadobj)[lnon];
    var dbreaddish=Object.keys(breadobj)[dbread];
    var dnondish=Object.keys(nonbreadobj)[dnon];
    var bcalfullfilltemp=breadobj[bbreaddish].calories+nonbreadobj[bnondish].calories;
    var bservingsizetemp=(Bcal/bcalfullfilltemp);
    var bservingsize=parseInt(bservingsizetemp*(breadobj[bbreaddish].servingSize+nonbreadobj[bnondish].servingSize));
    var bcalfullfill=parseInt(bservingsizetemp*(breadobj[bbreaddish].calories+nonbreadobj[bnondish].calories));
    var bcarbfullfill=parseInt(bservingsizetemp*(breadobj[bbreaddish].carbs+nonbreadobj[bnondish].carbs));
    var bfatfullfill=parseInt(bservingsizetemp*(breadobj[bbreaddish].fats+nonbreadobj[bnondish].fats));
    var bproteinfullfill=parseInt(bservingsizetemp*(breadobj[bbreaddish].protein+nonbreadobj[bnondish].protein));
    var lcalfullfilltemp=breadobj[lbreaddish].calories+nonbreadobj[lnondish].calories;
    var lservingsizetemp=(Lcal/lcalfullfilltemp);
    var lservingsize=parseInt(lservingsizetemp*(breadobj[lbreaddish].servingSize+nonbreadobj[lnondish].servingSize));
    var lcalfullfill=parseInt(lservingsizetemp*(breadobj[lbreaddish].calories+nonbreadobj[lnondish].calories));
    var lcarbfullfill=parseInt(lservingsizetemp*(breadobj[lbreaddish].carbs+nonbreadobj[lnondish].carbs));
    var lfatfullfill=parseInt(lservingsizetemp*(breadobj[lbreaddish].fats+nonbreadobj[lnondish].fats));
    var lproteinfullfill=parseInt(lservingsizetemp*(breadobj[lbreaddish].protein+nonbreadobj[lnondish].protein));
    var dcalfullfilltemp=breadobj[dbreaddish].calories+nonbreadobj[dnondish].calories;
    var dservingsizetemp=(Dcal/dcalfullfilltemp);
    var dservingsize=parseInt(dservingsizetemp*(breadobj[dbreaddish].servingSize+nonbreadobj[dnondish].servingSize));
    var dcalfullfill=parseInt(dservingsizetemp*(breadobj[dbreaddish].calories+nonbreadobj[dnondish].calories));
    var dcarbfullfill=parseInt(dservingsizetemp*(breadobj[dbreaddish].carbs+nonbreadobj[dnondish].carbs));
    var dfatfullfill=parseInt(dservingsizetemp*(breadobj[dbreaddish].fats+nonbreadobj[dnondish].fats));
    var dproteinfullfill=parseInt(dservingsizetemp*(breadobj[dbreaddish].protein+nonbreadobj[dnondish].protein));
    console.log(bbreaddish.calories);

    res.render("tracker",{login_value:req.isAuthenticated(),
      bbreadd:breadobj[bbreaddish].name,
      bnond:nonbreadobj[bnondish].name,
      lbreadd:breadobj[lbreaddish].name,
      lnond:nonbreadobj[lnondish].name,
      dbreadd:breadobj[dbreaddish].name,
      dnond:nonbreadobj[dnondish].name,
      bserving:bservingsize,
      lserving:lservingsize,
      dserving:dservingsize,
      bcalf:bcalfullfill,
      bproteinf:bproteinfullfill,
      bcarbohydratef:bcarbfullfill,
      bfatf:bfatfullfill,
      lcalf:lcalfullfill,
      lproteinf:lproteinfullfill,
      lcarbohydratef:lcarbfullfill,
      lfatf:lfatfullfill,
      dcalf:dcalfullfill,
      dproteinf:dproteinfullfill,
      dcarbohydratef:dcarbfullfill,
      dfatf:dfatfullfill,
      bproteinr:Bprotein,
      bcarbohydrater:Bcarbohydrate,
      bfatr:Bfat,
      lproteinr:Lprotein,
      lcarbohydrater:Lcarbohydrate,
      lfatr:Lfat,
      dproteinr:Dprotein,
      dcarbohydrater:Dcarbohydrate,
      dfatr:Dfat,
      bcalr:Bcal,
      lcalr:Lcal,
      dcalr:Dcal
    });

  }
  else{
    res.redirect("/");
  }    
  
  });       

app.post("/register",function(req,res){
        
  User.register({split:"",name:req.body.name,weight:null,height:null,age:null,email:req.body.username,username:req.body.username,goal:"",activitylevel:"",cuisine:"",gender:"",allergens:[], active: false}, req.body.password, function(err, user) {
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
