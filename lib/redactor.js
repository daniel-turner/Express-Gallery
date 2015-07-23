module.exports = redactor;

var replacements = {

  selfie : "self-portrait",
  yummers : "delicious",
  outchea : "are out here",
  bruh : "wow",
  doge : "pug",
  cilantro : "soap",
  bae : "loved one",
  swag : "style",
  yolo : "carpe diem"
};

function redactor(req,res,next) {

  if( req.body.author === undefined ||
      req.body.description === undefined) {

    next();

  } else {

    var targets = Object.keys(replacements);

    for(var i = 0;i < targets.length;i++) {

      redact(req,targets[i],replacements[targets[i]]);
    }

    next();
  }
};

function redact(req,target,replacement) {

  var regex = new RegExp(target,'ig');

  req.body.author = req.body.author.replace(regex,replacement);
  req.body.description = req.body.description.replace(regex,replacement);
};