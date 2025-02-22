// routes/taskRoutes.js
const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middlewares/authMiddleware')

// GET /tasks -> показывает список задач (и форму создания)
router.get('/', authMiddleware, taskController.showTasksPage)
router.post('/', authMiddleware, taskController.createTask)
router.get('/edit/:id', authMiddleware, taskController.editTaskForm) // показать форму редактирования
router.post('/edit/:id', authMiddleware, taskController.updateTask)
router.delete('/delete/:id', authMiddleware, taskController.deleteTask)

module.exports = router
