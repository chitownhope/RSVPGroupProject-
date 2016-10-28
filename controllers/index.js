var express = require('express');
var router = express.Router();
var FormModel = require('../models/Form');
var bcrypt = require('bcryptjs');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RSVP' });
});



router.post('/login/verify', attemptToLogin);
router.get('/form', renderForm);
router.get('/login', renderLogin);
router.post('/create', attemptToRegister, insertIntoUserAccountsTable);

function renderForm(req, res, next) {
  res.render('form', {});

};

function renderLogin(req, res, next) {
  res.render('login', {});

};

function insertIntoUserAccountsTable(req, res, next) {
  console.log(req.body);

  var model = new FormModel(req.body).save().then(function(data) {
    res.render('home', data.attributes);

  });

};


function attemptToRegister(req, res, next) {
  console.log(req.body);
  var password = req.body.password_hash;
  var hashedPassword = createPasswordHash(password);
  var account = new FormModel({
    name: req.body.name,
    email: req.body.email,
    password_hash: hashedPassword
  }).save().then(function(result) {
    res.render('home');
  });
};

function createPasswordHash (password) {
  var salt = 10;
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

function comparePasswordHashes (input, db) {
  //
  // var hash = createPasswordHash(input);
  return bcrypt.compareSync(input, db);
};

function attemptToLogin(req, res, next) {
  var password = req.body.password_hash;
  FormModel.where('email', req.body.email).fetch().then(
      function(result) {
        var attempt = comparePasswordHashes(req.body.password_hash, result.attributes.password_hash);
        res.json({'is_logged_in': attempt});
      });
};




module.exports = router;