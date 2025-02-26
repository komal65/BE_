var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require("./users");
const CarModel = require("./Car");
const passport = require('passport');
const upload = require('./multer');
const localStrategy = require("passport-local");

// Passport configuration
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router.get('/', function(req, res, next) {
  res.render('i');
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile', { user: req.user });
});

router.get('/practice', function(req, res, next) {
  res.render('practice');
});

router.get('/game', isLoggedIn, function(req, res, next) {
  res.render('game');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

// let Car = [];

// router.get('/Car', (req, res) => {
//   res.render('Car', { Car });  
// });

// router.post('/showcar', async(req, res) => {
//   const { carName, carModelName, price, year, fuelType, type, carImages, run } = req.body;

//   try {
//     const newCar = new CarModel({ carName, carModelName, price, year, fuelType, type, carImages, run });
//     await newCar.save();
//     res.redirect('/showcar');
//   } catch (err) {
//     console.error('Error saving car data:', err);
//     res.status(500).send('Error saving car data');
//   }
// });

// router.get('/showcar', async (req, res) => {
//   try {
//     const cars = await CarModel.find();
//     res.render('showcar', { Car: cars });
//   } catch (err) {
//     console.error('Error retrieving car data:', err);
//     res.status(500).send('Error retrieving car data');
//   }
// });

router.post('/register', async function(req, res) {
  try {
    const { username, email, contact, role, password } = req.body;
    
    // Create the user object
    const userData = new userModel({ username, email, contact, role });

    // Register the user using passport-local-mongoose
    const registeredUser = await userModel.register(userData, password);
    
    // Log the user in after registration
    req.login(registeredUser, (err) => {
      if (err) {
        console.error('Error logging in after registration:', err);
        return res.redirect('/login');
      }
      return res.redirect('/');
    });
  } catch (err) {
    console.error('Error during registration:', err);
    // Send a more user-friendly error message
    if (err.name === 'UserExistsError') {
      return res.status(400).send('A user with the given username is already registered');
    }
    res.status(500).send('Error during registration: ' + err.message);
  }
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;




// router.get('/about', function(req, res, next) {
//   res.render('about');
// });

// router.get('/service', function(req, res, next) {
//   res.render('service');
// });