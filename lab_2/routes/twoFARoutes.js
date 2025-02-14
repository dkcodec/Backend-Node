const express = require('express')
const router = express.Router()

const twoFAController = require('../controllers/twoFAController')

// middleware для проверки, что пользователь залогинен
function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login')
  }
  next()
}

router.get('/setup', isLoggedIn, twoFAController.getSetup2FA)
router.post('/setup', isLoggedIn, twoFAController.postSetup2FA)

router.get('/verify', isLoggedIn, twoFAController.getVerify2FA)
router.post('/verify', isLoggedIn, twoFAController.postVerify2FA)

module.exports = router
