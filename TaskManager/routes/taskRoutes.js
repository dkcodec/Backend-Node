const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middlewares/authMiddleware')
const { validate, taskSchema } = require('../middlewares/validation')

// GET /tasks -> показывает список задач (и форму создания)
router.get('/', authMiddleware, taskController.showTasksPage)
router.post(
  '/',
  authMiddleware,
  validate(taskSchema, 'tasks'),
  taskController.createTask
)
router.get('/edit/:id', authMiddleware, taskController.editTaskForm) // показать форму редактирования
router.post(
  '/edit/:id',
  authMiddleware,
  validate(taskSchema, 'editTask'),
  taskController.updateTask
)
router.post('/delete/:id', authMiddleware, taskController.deleteTask)
module.exports = router
