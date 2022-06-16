//npm install express --save.
//npm install express-session --save.
//npm install mysql --save.

const { json } = require('body-parser');
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const fs = require('fs');

var app = express();
const port = process.env.PORT || 8080;
const jsonFile = require("./JAILbird.json");

app.use(session({ 
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("www"));

const connection = mysql.createConnection({ //http://localhost/phpmyadmin/ Open XAMPP, run Apache & mysql
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'loginsystem'
});


console.log(jsonFile); //Testing Purposes, check if JSON has loaded in


app.set('view engine', 'ejs');



// View the List of Not Allowed places
app.get('/redZones', function (req, res) {
   fs.readFile( __dirname + "/" + "JAILbird.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})



// EJS 
 app.get('/', function(request, response) {  
   response.render('maps', { holder: jsonFile});
 });

 //Cited from https://codeshack.io/basic-login-system-nodejs-express-mysql/

 app.post('/auth', function(request, response) {
	// Capture the input fields
  console.log(request.body);

	let email = request.body.email;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
        request.session.email = email;
        request.session.name = results[0].name;
        request.session.admin = results[0].admin;
				// Redirect to home page

        if (request.session.admin) {
			console.log("Admin has logged in")
          response.redirect('/admin');
        } else {
			
				response.redirect('/about');
        }
			} else {
				console.log("User has entered incorrect Data")
				response.render('login', {wrongInfo: true});
				
			}			
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});

app.post('/addArea', function(request, response) {
	console.log(request.body);
	let name = request.body.name;
	let xcoord = request.body.xcoord;
	let ycoord = request.body.ycoord;
	let pop = request.body.population;

	
	jsonFile.redZones.push({city: name, center: { lat: parseFloat(xcoord), lng: parseFloat(ycoord), }, population: parseFloat(pop)});
	fs.writeFileSync("./JAILbird.json", JSON.stringify(jsonFile));
	console.log(name + " has been added to JSON file")
	response.redirect('/admin');
});

app.post('/removeArea', function(request, response) {
	console.log(request.body);
	let area = request.body.deletelocal;
	jsonFile.redZones.splice((area),1);
	fs.writeFileSync("./JAILbird.json", JSON.stringify(jsonFile));
	console.log("Area has been removed from JSON file")
	response.redirect('/admin');
});

  app.get('/login', function(request, response) {  
      response.render('login', {wrongInfo: false}); 
 });

 app.get('/about', function(request, response) { 
		response.render('index');
  });

  app.get('/registration', function(request, response) {  
    response.render('registration');
  });

  app.post('/register', function(request,response) {
	  
	connection.query('INSERT INTO users(name, email, password, admin) VALUES (?,?,?,?)', [request.body.name, request.body.email, request.body.password, 0], function (err, records) {
 
                if (err) {
					response.redirect('registration');
					console.log(err)
				}
 
            });
    });

  app.get('/landing', function(request, response) {  
    response.render('landing');
  });

  app.get('/admin', function(request, response) { 
    if (request.session.admin) {
      response.render('adminHub', {holder: jsonFile });
    } else {
	console.log("Non-Admin cannot access admin page");
     response.redirect('landing');
   } 
  });
	
	app.get('/news', function(request, response) {  
		response.render('news');
	  });

	app.get('/emergency', function(request, response) {  
		response.render('emergency');
	});
	


app.listen(port);
console.log('Server started at http://localhost:' + port);