var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var db = require('../models');
var redactor = require("../lib/redactor.js");
var method_override = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

var HASHING_ALGORITHM = 'SHA512';
var HASH_ENCODING = 'hex';

function getHash(password) {

  var hash_algorithm = crypto.createHash(HASHING_ALGORITHM);
  hash_algorithm.update(password);
  return hash_algorithm.digest(HASH_ENCODING);
}

app.use(session(
  {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(method_override(function(req,res) {

  if(req.body.method === "put") {

    req.url = req.url + "/" + req.body.id;

    return "PUT";

  } else if(req.body.method === "delete") {

    return "DELETE";
  }
}));

passport.serializeUser(function(user, done) {

    done(null, user.id);
});

passport.deserializeUser(function(id, done) {

  db.user.findById(id).then( function(user){

    done(null, user);
  });
});

passport.use(new LocalStrategy(

  function(username, password, done) {

    db.user.findOne({ username: username }

    ).then(function(user) {

      // if (error) {

      //   console.log(error);

      //   return done(error);
      // }

      if (!user) {

        console.log("Unknown username");

        return done(null, false, { message: 'Unknown username.' });
      }

      var match = false;

      if(getHash(password) === user.password) {

        match = true;
      }

      if (!match) {

        console.log("DB Password: " + user.password);
        console.log("Submitted Hash Password: " + getHash(password));
        console.log("Password: " + password);


        console.log("Incorrect password");

        return done(null, false, { message: 'Incorrect password.' });
      }

      console.log("SUCCESS!");

      return done(null, user);
    });
  }
));

app.use(redactor);

app.set('view engine', 'jade');

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'})
);

app.get('/login', function (req, res) {

  res.render('login');
});

app.get('/logout', function(req, res){

  req.logout();
  res.redirect('/');
});

app.get('/createUser', function(req,res) {

  res.render("create_user");
});

app.post('/createUser', function(req, res) {

  db.user.findAll({

    where: {

      username: req.params.username
    }
  }).then(function(user) {

    if(user.length < 1) {

      var hashed_password = getHash(req.body.password);

      db.user.create({

        username: req.body.username,
        password: hashed_password

      }).then(function() {

        db.image.findAll()
          .then(function(images) {

            // res.json(images);
            res.render("index", {

              images: images
            }
          );
        });
      });

    } else {

      res.send('Username is already taken.')
    }
  });
});

app.get('/', function (req, res) {

  db.image.findAll()
    .then(function(images) {

      // res.json(images);
      res.render("index", {

        images: images
      }
    );
  });
});

app.get('/gallery/:id', function (req, res) {

  db.image.findAll({

    where: {

      id: req.params.id
    }

  }).then(function(image){

    if(image.length < 1) {

      res.status(404);
      res.send("Could not locate the requested resource.");
    } else {

      // res.json(image);
      res.render("single_image_display", {

        image: image[0]
      });
    }
  });
});

app.get('/new_photo', function (req, res) {

  res.render("single_image_edit", {

    image: {
      author: "Your name!",
      link: "URL here!",
      description: "Describe your image here!"
    }
  });
});

app.get('/gallery/:id/edit', ensureAuthenticated, function (req, res) {

  db.image.findAll({

    where: {

      id: req.params.id
    }
  }).then(function(image) {

    if(image.length < 1) {

      res.status(404);
      res.send("Could not locate the requested resource.");

    } else {

      res.render("single_image_edit", {

        image: image[0]
      });
    }
  });
});

app.post('/gallery', function (req, res) {

  db.image.create({

    author: req.body.author,
    link: req.body.link,
    description: req.body.description

  }).then(function(image) { //may be unnecessary

    db.image.findAll({

      where: {

        id: image.id
      }
    }).then(function(image) {

      res.render("single_image_display", {

        image: image[0]
      });
    });
  });
});

app.put('/gallery/:id', ensureAuthenticated, function (req, res) {

  db.image.findAll({

    where: {

      id: req.params.id
    }

  }).then(function(image){

    // console.log(image[0].dataValues);

    if(image.length < 1) {

      res.status(404);
      res.send("Could not locate the requested resource.");
    }

    if(req.body.author !== undefined) {

      image[0].dataValues.author = req.body.author;
    }

    if(req.body.link !== undefined) {

      image[0].dataValues.link = req.body.link;
    }

    if(req.body.description !== undefined) {

      image[0].dataValues.description = req.body.description;
    }

    // console.log(image[0].dataValues);

    image[0].save({

      fields: ['author','link','description']

    }).then(function(image) {

      res.render("single_image_display", {

        image: image
      });
    });
  });
});

app.delete('/gallery/:id', ensureAuthenticated, function (req, res) {

  db.image.findAll({

    where: {

      id: req.params.id
    }
  }).then(function(image) {

    // console.log(image);

    if(image.length < 1) {

      res.status(404);
      res.send("Could not locate the requested resource.");

    } else {

      image[0].destroy().then(function() {

        db.image.findAll()
        .then(function(images) {

          // res.json(images);
          res.render("index", {

            images: images
          });
        });
      });
    }
  });
});

function ensureAuthenticated(req, res, next) {

  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);

  db.sequelize.sync();
});