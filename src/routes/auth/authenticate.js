const isAuthenticated = (req, res, next) => {
  if (req.user.authenticated)
    return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/');
}