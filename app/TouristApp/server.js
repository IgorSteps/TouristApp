const { json } = require('body-parser');
const express = require('express');
const path = require('path');
var app = express();
const port = process.env.PORT || 8080;
const jsonFile = require("./JAILbird.json");

console.log(jsonFile); //Testing Purposes, check if JSON has loaded in


app.set('view engine', 'ejs');
app.use(express.static("www"));


// View the List of Not Allowed places
app.get('/redZones', function (req, res) {
   fs.readFile( __dirname + "/" + "JAILbird.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

// // HTML
// app.get("/", function (req, res) {
//    res.sendFile(path.join(__dirname, '/www/index.html'));
// });

// app.get("/map", function (req, res) {
//    res.sendFile(path.join(__dirname, '/www/maps.html'));
// });


// EJS 
app.get('/test', function(request, response) {  
   response.render('maps', { holder:jsonFile });
 });

 app.get('/test2', function(request, response) {  
   response.render('index');
 });

 app.get('/test3', function(request, response) {  
   response.render('news');
 });

app.listen(port);
console.log('Server started at http://localhost:' + port);