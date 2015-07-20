var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('../models');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'jade');

app.get('/', function (req, res) {

  db.image.findAll()
    .then(function(images) {

      res.json(images);
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

      res.json(image);
    }
  });
});

app.get('/new_photo', function (req, res) {

  res.send('Got a GET for a page for loading new image');
});

app.get('/gallery/:id/edit', function (req, res) {

  db.image.findAll({

    where: {

      id: req.params.id
    }
  }). then(function(image) {

    if(image.length < 1) {

      res.status(404);
      res.send("Could not locate the requested resource.");
    }
  });
  res.send('Got a GET for editing an existing image');
});

app.post('/gallery', function (req, res) {

  db.image.create({

    author: req.body.author,
    link: req.body.link,
    description: req.body.description

  }).then(function(image) {

    res.json(image);
  });
});

app.put('/gallery/:id', function (req, res) {

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

    }).then(function() {

      console.log(image);

      res.json(image);
    });
  });
});

app.delete('/gallery/:id', function (req, res) {

  db.image.findAll({

    where: {

      id: req.params.id
    }
  }).then(function(image) {

    console.log(image);

    if(image.length < 1) {

      res.status(404);
      res.send("Could not locate the requested resource.");

    } else {

      image[0].destroy().then(function() {

        res.end();
      });
    }
  });
});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);

  db.sequelize.sync();
});