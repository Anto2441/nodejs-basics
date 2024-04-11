/**
 * This is the main entry point of our application, this file starts
 * the Express server and sets up the routes and middleware.
 */

const path = require('path');

const express = require('express');

const app = express();

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

// Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

// This sets the view engine, so that when we call res.render('some-view'),
// Express knows which template engine to use to render that view.
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

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Handler
app.use(errorController.get404);

// Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Sequelize Setup
sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Anto', email: 'anto@example.com' });
    }
    return user;
  })
  .then((user) => {
    //console.log('user', user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
