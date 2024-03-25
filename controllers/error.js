exports.get404 = (req, res, next) => {
  // Render the 404 page
  res.status(404).render('404', { docTitle: 'Page Not Found', path: '/404' });
};
