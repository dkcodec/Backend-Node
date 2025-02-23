// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    // Если нет токена, редирект на /login (или вернуть 401)
    return res.status(200).redirect('/login', { errors: ['Unauthorized'] })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    // Некорректный токен
    return res.status(200).redirect('/login', { errors: ['Unauthorized'] })
  }
}
