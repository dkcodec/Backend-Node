const User = require('../models/User')
const Task = require('../models/Task')
const bcrypt = require('bcrypt')

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const user = await User.findById(userId).select('-password').lean()

    if (!user) {
      return res
        .status(404)
        .render('profile', { user, error: 'User not found' })
    }

    return res.status(200).render('profile', { user, error: null })
  } catch (error) {
    next(error)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { username, email, password } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).render('profile', { error: 'User not found' })
    }

    if (username) user.username = username
    if (email) user.email = email
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }
    await user.save()
    return res
      .status(200)
      .render('profile', { user, error: 'User succesfully updatated' })
  } catch (error) {
    next(error)
  }
}

exports.adminPanel = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean() // Get all users
    const tasks = await Task.find().lean() // Get all tasks
    const userTasks = {}
    users.forEach((user) => {
      userTasks[user._id] = tasks.filter(
        (task) => String(task.user) === String(user._id)
      )
    })

    return res.status(200).render('admin', { users, userTasks, error: null })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    // Delete user
    await User.findByIdAndDelete(userId)

    // Delete all tasks of this user
    await Task.deleteMany({ user: userId })

    return res.status(200).redirect('/users/admin')
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.updateByAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id
    const { username, email, role } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).redirect('/users/admin')
    }

    // Update user
    if (username) user.username = username
    if (email) user.email = email
    if (role) user.role = role

    await user.save()

    return res.status(200).redirect('/users/admin')
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id
    await Task.findByIdAndDelete(taskId)
    return res.status(200).redirect('/users/admin')
  } catch (error) {
    console.error(error)
    next(error)
  }
}
