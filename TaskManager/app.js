// app.js
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

// Указываем EJS в качестве шаблонизатора
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// МИДЛВАР, который будет сохранять данные о пользователе в res.locals
app.use((req, res, next) => {
  const token = req.cookies.token
  if (token) {
    try {
      // Пытаемся декодировать JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // В res.locals.user можно сохранить всё, что нужно в шаблонах
      res.locals.user = decoded
    } catch (err) {
      // Некорректный или просроченный токен
      res.locals.user = null
    }
  } else {
    // Нет токена
    res.locals.user = null
  }
  next()
})

// Роут для логаута
app.get('/logout', (req, res) => {
  // Удаляем куки и перебрасываем на главную
  res.clearCookie('token')
  return res.redirect('/')
})

// Импортируем роуты
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')

// Пример страниц (главная, логин, регистрация) — это просто GET-запросы для рендеринга
// app.js
app.get('/', async (req, res) => {
  if (res.locals.user) {
    // Если пользователь авторизован, показываем ему задачи
    // Либо можем сделать redirect('/tasks'), но тут покажу как прямо на / отображать задачи

    // Для этого нужно получить список задач из базы
    // Если user.role === 'admin' -> берем все задачи
    // иначе -> берем задачи только текущего пользователя
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
        .render('index', { error: 'Ошибка при получении задач' })
    }

    // Рендерим шаблон (например, можно использовать тот же, что и /tasks)
    return res.render('tasks', { tasks, error: null })
  } else {
    // Если не авторизован
    return res.render('index')
  }
})

// Подключаем API-роуты / контроллеры
app.use('/', authRoutes) // /register, /login
app.use('/users', userRoutes) // /users/profile и т.п.
app.use('/tasks', taskRoutes) // /tasks CRUD (доступ только авторизованным)

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack)
  return res.status(500).json({ error: 'Server Error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
