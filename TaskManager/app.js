const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// set styles
app.use(express.static('public'))

// Middleware for saving user data in res.locals
app.use((req, res, next) => {
  const token = req.cookies.token
  if (token) {
    try {
      // decode JWT and save user data in res.locals
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // In res.locals.user you can save everything you need in templates
      res.locals.user = decoded
    } catch (err) {
      // Invalid token
      res.locals.user = null
    }
  } else {
    // No token
    res.locals.user = null
  }
  next()
})

// LogOut route
app.get('/logout', (req, res) => {
  // Clear cookie and redirect to home page
  res.clearCookie('token')
  return res.redirect('/')
})

//Import routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')

// Home routes
app.get('/', async (req, res) => {
  if (res.locals.user) {
    // If user is authorized, show him tasks

    // Get tasks from the database
    // If user.role === 'admin' -> get all tasks
    // else -> get only tasks of the current user
    const Task = require('./models/Task')
    let tasks = []

    try {
      if (res.locals.user.role === 'admin') {
        tasks = await Task.find({})
      } else {
        tasks = await Task.find({ user: res.locals.user.userId })
      }
    } catch (err) {
      return res
        .status(500)
        .render('tasks', { task: null, errors: ['Ошибка при получении задач'] })
    }

    return res.render('tasks', { tasks, task: null, errors: [] })
  } else {
    return res.render('index')
  }
})

// getting api-routes / controllers
app.use('/', authRoutes) // /register, /login
app.use('/users', userRoutes) // /users/profile и т.п.
app.use('/tasks', taskRoutes) // /tasks CRUD

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  return res.status(500).json({ error: 'Server Error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
