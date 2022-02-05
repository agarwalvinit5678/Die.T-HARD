//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
var _ = require('lodash');
const ejs = require("ejs");

``

const app = express();

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
      res.render("profile");
      
      });
      app.get("/tracker",function(req,res){
        res.render("tracker");
        
        });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
