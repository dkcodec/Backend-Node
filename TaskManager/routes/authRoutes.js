const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const {
  validate,
  registerSchema,
  loginSchema,
} = require('../middlewares/validation')

// GET /login — вернуть страницу (login.ejs)
router.get('/login', (req, res) => {
  res.render('login', { errors: [] })
})

// POST /login — обработка логина (контроллер)
router.post('/login', validate(loginSchema, 'login'), authController.login)

// GET /login — вернуть страницу (login.ejs)
router.get('/register', (req, res) => {
  res.render('register', { errors: [] })
})

// POST /login — обработка логина (контроллер)
router.post(
  '/register',
  validate(registerSchema, 'register'),
  authController.register
)

module.exports = router
