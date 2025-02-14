const express = require('express')
const session = require('express-session')
const path = require('path')

const authRoutes = require('./routes/authRoutes')
const twoFARoutes = require('./routes/twoFARoutes')

require('./config/db')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: 'YOUR_SESSION_SECRET', // замените на свой секрет
    resave: false,
    saveUninitialized: false,
  })
)

app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

app.get('/', (req, res) => {
  res.render('index') // рендер views/index.ejs
})

app.use('/auth', authRoutes)
app.use('/2fa', twoFARoutes)

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user })
})

// Пример middleware для проверки логина + 2FA
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login')
  }
  // Если 2FA включена у пользователя - проверяем, прошёл ли он верификацию
  if (req.session.user.is2FAEnabled && !req.session.is2FAAuthenticated) {
    return res.redirect('/2fa/verify')
  }
  next()
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT)
})
