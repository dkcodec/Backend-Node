const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const {
  validate,
  registerSchema,
  loginSchema,
} = require('../middlewares/validation')

router.get('/login', (req, res) => {
  res.render('login', { errors: [] })
})

router.post('/login', validate(loginSchema, 'login'), authController.login)

router.get('/register', (req, res) => {
  res.render('register', { errors: [] })
})

router.post(
  '/register',
  validate(registerSchema, 'register'),
  authController.register
)

module.exports = router
