function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    req.flash('error', 'Please log in to view that resource');
    res.redirect('/login');
  }
}

module.exports = ensureAuthenticated;

