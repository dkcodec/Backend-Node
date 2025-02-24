const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middlewares/authMiddleware')
const { validate, taskSchema } = require('../middlewares/validation')

router.get('/', authMiddleware, taskController.showTasksPage)
router.post(
  '/',
  authMiddleware,
  validate(taskSchema, 'tasks'),
  taskController.createTask
)
router.get('/edit/:id', authMiddleware, taskController.editTaskForm)
router.post(
  '/edit/:id',
  authMiddleware,
  validate(taskSchema, 'editTask'),
  taskController.updateTask
)
router.post('/delete/:id', authMiddleware, taskController.deleteTask)
module.exports = router
