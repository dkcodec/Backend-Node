const User = require('../models/User')
const bcrypt = require('bcrypt')

const saltRounds = 10

exports.getRegister = (req, res) => {
  res.render('auth/register')
}

exports.postRegister = async (req, res) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.render('auth/register', {
        error: 'Пользователь с таким email уже существует.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = new User({
      email,
      password: hashedPassword,
    })
    await user.save()

    return res.redirect('/auth/login')
  } catch (err) {
    console.error('Ошибка при регистрации:', err)
    return res.render('auth/register', {
      error: 'Произошла ошибка при регистрации.',
    })
  }
}

exports.getLogin = (req, res) => {
  res.render('auth/login')
}

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.render('auth/login', { error: 'Неверный email.' })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.render('auth/login', { error: 'Неверный пароль.' })
    }

    req.session.user = {
      _id: user._id,
      email: user.email,
      is2FAEnabled: user.is2FAEnabled,
      twoFASecret: user.twoFASecret,
    }

    // Если 2FA включена – перенаправляем на проверку OTP
    if (user.is2FAEnabled) {
      req.session.is2FAAuthenticated = false
      return res.redirect('/2fa/verify')
    }

    // Если 2FA не включена, сразу даём доступ
    req.session.is2FAAuthenticated = true
    return res.redirect('/dashboard')
  } catch (err) {
    console.error('Ошибка при входе:', err)
    return res.render('auth/login', { error: 'Произошла ошибка при входе.' })
  }
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}
