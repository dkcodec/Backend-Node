const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')

router.get('/profile', authMiddleware, userController.getProfile)
router.post('/profile', authMiddleware, userController.updateProfile)

router.get('/admin', authMiddleware, adminMiddleware, userController.adminPanel)
router.post(
  '/admin/users/delete/:id',
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
)
router.post(
  '/admin/tasks/delete/:id',
  authMiddleware,
  adminMiddleware,
  userController.deleteTask
)
router.post(
  '/admin/users/update/:id',
  authMiddleware,
  adminMiddleware,
  userController.updateByAdmin
)

module.exports = router
