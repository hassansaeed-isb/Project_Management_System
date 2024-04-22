var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var session = require('express-session');
var http = require('http');
var fs = require('fs');


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the view engine
app.set('view engine', 'ejs');
var path = require('path');
app.set('views', path.join(__dirname, '.'));

var mysql = require("mysql");
var connection = mysql.createConnection({
    host : 'localhost',
    database: 'DB_Project',
    user : 'root',
    password: 'change@123',
    port:'3306',
});
module.exports = connection;
 app.use(session({
      secret: 's3Cur3$S!onS3cr3T',
      resave: false,
      saveUninitialized: true
    }));
    
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/front.html');
  });
  app.use('/', express.static('views'));

  
  app.post('/register', function (req, res) {
    var postData = req.body;
    connection.query('INSERT INTO users SET ?', postData, function (error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    });
  });
  
  app.get("/login.html", function (req, res) {
    res.sendFile(__dirname + '/login.html');
  });
  
  app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
  
    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
      if (error) throw error;
  
      // If user found and password matches
      if (results.length > 0) {
        var userType = email === 'admin@gmail.com' ? 'admin' : 'user';
        req.session.userType = userType;
  
        if (userType === 'admin') {
          res.redirect('/admin');
        } else {
          req.session.userType = 'user'; // Set userType in the session
          connection.query('SELECT * FROM project', function (error, projectResults, fields) {
            if (error) throw error;
  
            // Render the userProject.ejs template with the project data
            res.render('userProject', { projects: projectResults });
          });
        }
      } else {
        res.send('Invalid email or password');
      }
    });
  });
  
  app.get('/admin', function (req, res) {
    var userType = req.session.userType;
  
    if (userType === 'admin') {
      // Get the projects from the database
      connection.query('SELECT * FROM project', function (error, projectResults, fields) {
        if (error) throw error;
  
        // Render the adminProject.ejs template with the project data and userType
        res.render('adminProject', { projects: projectResults, userType: userType });
      });
    } else {
      // Redirect unauthorized users back to the login page
      res.redirect('/login.html');
    }
  });
  

app.post('/admin/add', function (req, res) {
    var userType = req.session.userType;
  
    if (userType === 'admin') {
      var projectData = {
        name: req.body.name,
        description: req.body.description,
        team_lead: req.body.team_lead,
        status: req.body.status
    };

    connection.query('INSERT INTO project SET ?', projectData, function (error, results, fields) {
      if (error) throw error;
      res.redirect('/admin');
    });
  } else {
    res.redirect('/login.html');
  }
});
  
  
  app.post('/admin/delete', function (req, res) {
    var projectId = req.body.id;
  
    connection.query('DELETE FROM project WHERE id = ?', projectId, function (error, results, fields) {
      if (error) throw error;
      res.redirect('/admin');
    });
  });
  
  app.post('/admin/update', function (req, res) {
    var projectId = req.body.id
      // Get the project data from the form
  var projectData = {
    name: req.body.edit_name,
    description: req.body.edit_description,
    team_lead: req.body.edit_team_lead,
    status: req.body.edit_status
  };

  connection.query('UPDATE project SET ? WHERE id = ?', [projectData, projectId], function (error, results, fields) {
    if (error) throw error;
    res.redirect('/admin');
  });
});

app.get('/issue', function (req, res) {
    // Get the issues from the database
    if (!req.session.userType) {
      return res.redirect('/login.html');
    }
    connection.query('SELECT * FROM Issue', function (error, issueResults, fields) {
      if (error) throw error;
  
      // Render the issues.ejs template with the issue data
      res.render('issue', { issues: issueResults, userType: req.session.userType });
    });
  });
  
  app.get('/board', function (req, res) {
    // Get the boards from the database
    if (!req.session.userType) {
      return res.redirect('/login.html');
    }
    connection.query('SELECT * FROM Board', function (error, boardResults, fields) {
      if (error) throw error;
  
      // Render the board.ejs template with the board data
      res.render('board', { boards: boardResults, userType: req.session.userType });
    });
  });
  

app.get('/project', function (req, res) {
    if (!req.session.userType) {
      return res.redirect('/login.html');
    }
  
    var userType = req.session.userType;
  
    connection.query('SELECT * FROM project', function (error, projectResults, fields) {
      if (error) throw error;
  
      if (userType === 'admin') {
        // Render the adminProject.ejs template with the project data
        res.render('adminProject', { projects: projectResults, userType: userType  });
      } else {
        // Render the userProject.ejs template with the project data
        res.render('userProject', { projects: projectResults, userType: userType  });
      }
    });
  });
  app.get('/admin/edit/:id', function (req, res) {
    var projectId = req.params.id;
    
    connection.query('SELECT * FROM project WHERE id = ?', projectId, function (error, projectResults, fields) {
      if (error) throw error;
  
      // Render the editProject.ejs template with the project data
      res.render('editProject', { project: projectResults[0] });
    });
  });
  
  app.post('/admin/edit/:id', function (req, res) {
    var projectId = req.params.id;
    var projectData = {
      name: req.body.name,
      description: req.body.description,
      team_lead: req.body.team_lead,
      status: req.body.status
    };
  
    connection.query('UPDATE project SET ? WHERE id = ?', [projectData, projectId], function (error, results, fields) {
      if (error) throw error;
      res.redirect('/admin');
    });
  });
  app.get('/logout', function (req, res) {
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/login.html');
      }
    });
  });
  
app.listen(8080, function () {
  console.log("App listening on http://localhost:8080");
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Database connected");
  });
});