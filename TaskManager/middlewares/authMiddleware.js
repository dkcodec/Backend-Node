const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    // if no token, redirect to /login (or return 401)
    return res.status(200).redirect('/login', { errors: ['Unauthorized'] })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(200).redirect('/login', { errors: ['Unauthorized'] })
  }
}
