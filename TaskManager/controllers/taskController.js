// controllers/taskController.js
const Task = require('../models/Task')

exports.showTasksPage = async (req, res, next) => {
  try {
    // Из токена мы знаем userId (декодировать заново или передавать в req.user).
    // Допустим, в authMiddleware, вы можете сохранить req.user = jwt.verify(...)
    // Тогда здесь просто:
    const userId = getUserIdFromToken(req) // сделайте свою логику

    const tasks = await Task.find({ user: userId }).lean()
    // Рендерим EJS-страницу tasks.ejs и передаём массив tasks
    return res.render('tasks', { tasks, error: null })
  } catch (error) {
    next(error)
  }
}

exports.createTask = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const { title, description } = req.body

    // Создаём задачу, привязанную к текущему пользователю
    const newTask = new Task({
      title,
      description,
      status: 'pending',
      user: userId,
    })
    await newTask.save()

    return res.redirect('/tasks')
  } catch (error) {
    console.error(error)
    return res.redirect('/tasks')
  }
}

exports.editTaskForm = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const taskId = req.params.id

    const task = await Task.findById(taskId)
    if (!task) {
      return res.redirect('/tasks') // или отобразить ошибку
    }

    // Проверка прав: если не admin и не владелец, нет доступа
    if (role !== 'admin' && String(task.user) !== String(userId)) {
      return res.redirect('/tasks')
    }

    return res.render('editTask', { task, error: null })
  } catch (error) {
    console.error(error)
    return res.render('editTask', { task, error: 'Something went wrong' })
  }
}

/**
 * Обновление задачи (метод POST)
 */
exports.updateTask = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const taskId = req.params.id
    const { title, description, status } = req.body

    const task = await Task.findById(taskId)
    if (!task) {
      return res.redirect('/tasks')
    }

    // Проверяем права
    if (role !== 'admin' && String(task.user) !== String(userId)) {
      return res.redirect('/tasks')
    }

    // Обновляем поля
    if (title) task.title = title
    if (description) task.description = description
    if (status) task.status = status

    await task.save()
    return res.redirect('/tasks')
  } catch (error) {
    console.error(error)
    return res.redirect('/tasks')
  }
}

exports.deleteTask = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const taskId = req.params.id

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    }).lean()
    if (!task) {
      return res.redirect('/tasks')
    }
  } catch (error) {
    console.error(error)
    return res.redirect('/tasks')
  }
}

// Можете вынести эту логику в отдельную функцию или использовать req.user в authMiddleware
function getUserIdFromToken(req) {
  const token = req.cookies.token
  const decoded = token
    ? require('jsonwebtoken').verify(token, process.env.JWT_SECRET)
    : null
  return decoded ? decoded.userId : null
}
