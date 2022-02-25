const regionalFoodItems=require("./RegionalFoods.js");

const { response } = require("express");
const express=require("express");
const { request } = require("http");
const bodyParser=require("body-parser");

        

Object.values(regionalFoodItems).forEach(region=>{
    console.log();
    console.log(region);
    Object.values(region).forEach(dish=>{
        console.log(dish);
                
                
            
        
        })
});


/*
common[0].food_name
*/


const app=express();

app.use(bodyParser.urlencoded({extended:true}));

const https=require("https");



//Setting up the server at port 3000
app.listen(3000 , ()=>{
    console.log ("server started");
});
