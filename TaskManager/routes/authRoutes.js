const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// GET /login — вернуть страницу (login.ejs)
router.get('/login', (req, res) => {
  res.render('login')
})

// POST /login — обработка логина (контроллер)
router.post('/login', authController.login)

// GET /login — вернуть страницу (login.ejs)
router.get('/register', (req, res) => {
  res.render('register')
})

// POST /login — обработка логина (контроллер)
router.post('/register', authController.register)

module.exports = router
