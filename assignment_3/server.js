const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')

// Подключаем модель
const User = require('./models/user')

const app = express()
const PORT = 3000

// Подключение к MongoDB
mongoose
  .connect('mongodb://localhost:27017/assignment3', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err))

// Указываем EJS как шаблонизатор
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Подключаем статическую папку
app.use(express.static(path.join(__dirname, 'public')))

// Парсинг тела запросов
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Для поддержки PUT и DELETE запросов через HTML-формы
app.use(methodOverride('_method'))

// 1. Главная страница: список пользователей + поиск + сортировка
app.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search || ''
    const sortField = req.query.sort || 'name' // поля для сортировки
    const sortOrder = req.query.order === 'desc' ? -1 : 1

    // Поиск по имени (регистронезависимый)
    const users = await User.find({
      name: { $regex: searchQuery, $options: 'i' },
    }).sort({ [sortField]: sortOrder })

    res.render('index', { users, searchQuery, sortField, sortOrder })
  } catch (err) {
    console.log(err)
    res.status(500).send('Произошла ошибка при получении списка пользователей')
  }
})

// 2. Форма добавления пользователя
app.get('/new', (req, res) => {
  res.render('edit', { user: {}, title: 'Создать пользователя' })
})

// 3. Создание пользователя (Create)
app.post('/', async (req, res) => {
  try {
    const { name, age, email } = req.body
    await User.create({ name, age, email })
    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.status(500).send('Произошла ошибка при создании пользователя')
  }
})

// 4. Форма редактирования пользователя
app.get('/:id/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).send('Пользователь не найден')
    res.render('edit', { user, title: 'Редактировать пользователя' })
  } catch (err) {
    console.log(err)
    res.status(500).send('Произошла ошибка при получении пользователя')
  }
})

// 5. Обновление пользователя (Update)
app.put('/:id', async (req, res) => {
  try {
    const { name, age, email } = req.body
    await User.findByIdAndUpdate(req.params.id, { name, age, email })
    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.status(500).send('Произошла ошибка при обновлении пользователя')
  }
})

// 6. Удаление пользователя (Delete)
app.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.status(500).send('Произошла ошибка при удалении пользователя')
  }
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
