const regionalFoodItems=require("./RegionalFoods.js");

const { response } = require("express");
const express=require("express");
const { request } = require("http");
const bodyParser=require("body-parser");

        

// Object.values(regionalFoodItems).forEach(region=>{
//     console.log();
    
//         Object.values(region).forEach(dish=>{

//             Object.values(dish).forEach(foodCategory=>{
//                 console.log(foodCategory);
        
                
                
                
            
        
//             })
                
//         })
// });
// var awadhi=regionalFoodItems.awadhi;
// var nonBread = "nonBread";
// var awad=regionalFoodItems["awadhi"];
// console.log(awad["nonBread"]);
var cuisinename="awadhi";
var foodobj=regionalFoodItems[cuisinename];
var nonbread=foodobj["nonBread"];
   var nonbreadlength = Object.keys(foodobj["nonBread"]).length;
var obj=Object.keys(nonbread)[1];
console.log(nonbread[obj].name);
console.log(nonbread["kakhoriKebab"].calories+nonbread[obj].calories); 

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
