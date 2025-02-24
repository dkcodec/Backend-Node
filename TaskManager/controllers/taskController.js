const Task = require('../models/Task')
const User = require('../models/User')

exports.showTasksPage = async (req, res, next) => {
  try {
    const userId = getUserIdFromToken(req)

    const tasks = await Task.find({ user: userId }).lean()

    return res
      .status(200)
      .render('tasks', { tasks: tasks || [], task: null, errors: [] })
  } catch (error) {
    next(error)
  }
}

exports.createTask = async (req, res, next) => {
  try {
    const userId = req.user
    const { title, description, status } = req.body

    const user = await User.findById(userId).lean()

    // create new task
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

    // check if user has rights to edit this task
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

exports.updateTask = async (req, res, next) => {
  try {
    const { userId, role } = req.user
    const taskId = req.params.id
    const { title, description, status } = req.body

    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).redirect('/tasks')
    }

    if (role !== 'admin' && String(task.user) !== String(userId)) {
      return res.status(401).redirect('/tasks')
    }

    // update task fields
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
      return res.status(404).redirect('/tasks') // if task not found redirect to tasks page
    }

    // check if user has rights to delete this task
    if (role !== 'admin' && String(task.user) !== String(userId)) {
      return res.status(401).redirect('/tasks') // if user has no rights redirect to tasks page
    }

    await Task.findByIdAndDelete(taskId)

    return res.status(200).redirect('/tasks')
  } catch (error) {
    console.error(error)
    return res.status(200).redirect('/tasks')
  }
}

function getUserIdFromToken(req) {
  const token = req.cookies.token
  const decoded = token
    ? require('jsonwebtoken').verify(token, process.env.JWT_SECRET)
    : null
  return decoded ? decoded.userId : null
}
