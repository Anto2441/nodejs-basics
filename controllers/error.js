exports.get404 = (req, res, next) => {
  // Render the 404 page
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn,
  });
};
