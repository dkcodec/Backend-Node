const Task = require('../models/Task')
const User = require('../models/User')

exports.showTasksPage = async (req, res, next) => {
  try {
    // Из токена мы знаем userId (декодировать заново или передавать в req.user).
    // Допустим, в authMiddleware, вы можете сохранить req.user = jwt.verify(...)
    // Тогда здесь просто:
    const userId = getUserIdFromToken(req) // сделайте свою логику

    const tasks = await Task.find({ user: userId }).lean()

    // Рендерим EJS-страницу tasks.ejs и передаём массив tasks
    return res
      .status(200)
      .render('tasks', { tasks: tasks || [], task: null, errors: [] })
  } catch (error) {
    next(error)
  }
}

exports.createTask = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const { title, description, status } = req.body

    const user = await User.findById(userId).lean()

    // Создаём задачу, привязанную к текущему пользователю
    const newTask = new Task({
      title,
      description,
      status: status || 'pending',
      user: userId,
      username: user.username || 'Unknown',
    })
    await newTask.save()

    return res.status(200).redirect('/tasks')
  } catch (error) {
    console.error(error)
    return res.status(200).redirect('/tasks')
  }
}

exports.editTaskForm = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const taskId = req.params.id

    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).redirect('/tasks')
    }

    // Проверка прав: если не admin и не владелец, нет доступа
    if (role !== 'admin' && String(task.user) !== String(userId)) {
      return res.status(401).redirect('/tasks')
    }

    return res.status(200).render('editTask', { task, error: null })
  } catch (error) {
    console.error(error)
    return res
      .status(403)
      .render('editTask', { task, error: 'Something went wrong' })
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
      return res.status(404).redirect('/tasks')
    }

    // Проверяем права
    if (role !== 'admin' && String(task.user) !== String(userId)) {
      return res.status(401).redirect('/tasks')
    }

    // Обновляем поля
    if (title) task.title = title
    if (description) task.description = description
    if (status) task.status = status

    await task.save()
    return res.status(200).redirect('/tasks')
  } catch (error) {
    console.error(error)
    return res.status(403).redirect('/tasks')
  }
}

exports.deleteTask = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const taskId = req.params.id

    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).redirect('/tasks') // если задачи нет, просто редиректим назад
    }

    // Проверяем, имеет ли право пользователь удалять эту задачу
    if (role !== 'admin' && String(task.user) !== String(userId)) {
      return res.status(401).redirect('/tasks') // обычный юзер может удалять только свои задачи
    }

    await Task.findByIdAndDelete(taskId)

    return res.status(200).redirect('/tasks')
  } catch (error) {
    console.error(error)
    return res.status(200).redirect('/tasks')
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
