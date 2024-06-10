/**
 * This is the main entry point of our application, this file starts
 * the Express server and sets up the routes and middleware.
 */

const path = require('path');

const express = require('express');

const mongooseConnect = require('./util/database').mongooseConnect;
const MONGODB_URI = require('./util/database').MONGODB_URI;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

// This sets the view engine, so that when we call res.render('some-view'),
// In this case, we're using the EJS view engine.
app.set('view engine', 'ejs');

// This sets the directory where Express should look for views.
// In this case, it's the 'views' directory in the root of our project.
app.set('views', path.join(__dirname, 'views'));

// This line imports the routes for the admin section of the site
// and gives us access to them at `adminData.routes`.
const adminRoutes = require('./routes/admin');

// This line imports the routes for the shop section of the site
// and gives us access to them at `shopRoutes`.
const shopRoutes = require('./routes/shop');

// This line imports the routes for the authentication section of the site and gives us access to them at `authRoutes`.
// The authentication routes are responsible for handling the user's login and logout actions.
const authRoutes = require('./routes/auth');

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'azerty',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 Handler
app.use(errorController.get404);

mongooseConnect(() => {
  User.findOne({}).then((user) => {
    if (!user) {
      const user = new User({
        name: 'Anto',
        email: 'Toto@gmail.com',
        cart: {
          items: [],
        },
      });
      user.save();
    }
  });
  app.listen(3000);
});
