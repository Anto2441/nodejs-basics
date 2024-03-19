/**
 * index.js
 *
 * This is the main entry point of our application, this file starts
 * the Express server and sets up the routes and middleware.
 */

const express = require('express');

const path = require('path');

const app = express();

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminData.routes);
app.use(shopRoutes);

// 404 Handler
app.use((req, res, next) => {
  // Render the 404 page
  res.status(404).render('404', { docTitle: 'Page Not Found' });
});

// Start the server
app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
