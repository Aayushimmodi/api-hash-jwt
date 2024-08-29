var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var userModel = require('../Models/users');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
//Load JSON 
var jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
let blacklist = new Set();

// Middleware to check authentication 
var AuthJWT = (req, res, next) => {
  var token = req.headers.authorization;
  token = token.split(' ')[1];
  var privatekey = 'cbvbjgbgb';
  if (blacklist.has(token)) return res.sendStatus(403);
  jwt.verify(token, privatekey, function (err, decoded) {
    if (err) {
      console.log(err);
      res.send({ message: 'Invalid Token' });
    } else {
      next();
    }
  })
}
router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/register', function (req, res, next) {
  res.render('register');
});
// Register API
router.post('/register-api', function (req, res, next) {
  var mypassword = req.body.user_password
  const saltRounds = 1;
  bcrypt.hash(mypassword, saltRounds, function (err, epass) {
    const user_bodydata = {
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_number: req.body.user_number,
      user_password: epass
    }
    console.log("user =  " + req.body.user_email + " and hash password =  " + epass);
    const userdata = userModel(user_bodydata);
    userdata.save()
      .then(data => {
        res.send(JSON.stringify({ msg: 'Record added.' }));
      })
      .catch(err => console.log(err));
  })
});
//Login API 
router.post('/login-api', function (req, res, next) {
  var email = req.body.user_email;
  var password = req.body.user_password;
  console.log(req.body);
  userModel.findOne({ "user_email": email }).then(function (db_users_array) {
    if (db_users_array) {
      var db_email = db_users_array.user_email;
      var db_password = db_users_array.user_password;
    }
    console.log("db_users_array.user_email : " + db_email);
    console.log("db_users_array.user_password: " + db_password);
    if(db_email == null){
      console.log("If");
      res.send(JSON.stringify({ msg: 'Login Failed' }));
    }
    bcrypt.compare(password,db_password,function(err,result){
      if(db_email == email && result== true){
        var privatekey = 'cbvbjgbgb';
        let params =  {
          email :  db_users_array.email,
        }
        var token = jwt.sign(params,privatekey);
        console.log("Token is "+token);
        res.send(JSON.stringify({msg :  "Login Sucess", "Token": token}))
      }else{
        console.log('Credentials wrong');
        res.send(JSON.stringify({ msg: 'Login Failed' }));
      }
    })
  })
});
//Logout API
router.get('/logout-api',AuthJWT,function (req, res, next) {
  const token  =  req.header('Authorization')?.split(' ')[1];
  blacklist.add(token);
  res.send({msg : 'You have been Logged Out'});
});
//Display all records API using JWT
router.get('/display-api', AuthJWT,function (req, res, next) {
  userModel.find().then(function(db_users_array){
    console.log(db_users_array);
    res.json(db_users_array);
  })
});

module.exports = router;
