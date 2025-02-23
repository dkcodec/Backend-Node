module.exports = function (roles = []) {
  return (req, res, next) => {
    // If roles is a string, convert it to an array
    if (typeof roles === 'string') {
      roles = [roles]
    }

    // check if user role is in roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).render('index', { errors: ['Not allowed'] })
    }

    next()
  }
}
