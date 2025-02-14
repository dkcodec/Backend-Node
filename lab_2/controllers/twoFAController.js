const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const User = require('../models/User')
const session = require('express-session')

exports.getSetup2FA = async (req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.redirect('/auth/login')
    }

    // Если у пользователя уже есть секрет, можем использовать его,
    // либо сгенерировать заново. Здесь для примера генерируем,
    // если нету:
    if (!user.twoFASecret) {
      const secret = speakeasy.generateSecret({
        name: `My2FAApp (${user.email})`,
      })
      user.twoFASecret = secret.base32
      await user.save()
    }

    // Генерируем otpauth URL
    const otpauthUrl = speakeasy.otpauthURL({
      secret: user.twoFASecret,
      label: `My2FAApp (${user.email})`,
      encoding: 'base32',
    })

    // Генерируем QR-код (data URL)
    qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) {
        console.error('Ошибка генерации QR:', err)
        return res.render('twoFA/setup', { error: 'Ошибка генерации QR-кода' })
      }

      return res.render('twoFA/setup', {
        qrCodeData: dataUrl,
        error: null,
      })
    })
  } catch (err) {
    console.error('Ошибка при настройке 2FA:', err)
    return res.render('twoFA/setup', { error: 'Ошибка при настройке 2FA' })
  }
}

/**
 * POST-запрос проверки кода при настройке 2FA
 */
exports.postSetup2FA = async (req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.redirect('/auth/login')
    }

    const { token } = req.body

    // Проверяем код
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
    })

    if (!verified) {
      return res.render('twoFA/setup', {
        error: 'Неверный код. Попробуйте ещё раз.',
        qrCodeData: null,
      })
    }

    // Если код верный, включаем 2FA
    user.is2FAEnabled = true
    await user.save()

    // Обновляем данные в сессии
    req.session.user.is2FAEnabled = true

    res.redirect('/dashboard')
  } catch (err) {
    console.error('Ошибка подтверждения 2FA:', err)
    return res.render('twoFA/setup', {
      error: 'Ошибка подтверждения 2FA',
      qrCodeData: null,
    })
  }
}

/**
 * GET-запрос на страницу верификации 2FA (при входе)
 */
exports.getVerify2FA = (req, res) => {
  if (req.session.is2FAAuthenticated) {
    return res.redirect('/dashboard')
  }
  res.render('twoFA/verify', { error: null })
}

/**
 * POST-запрос для проверки одноразового кода 2FA (после логина)
 */
exports.postVerify2FA = async (req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.redirect('/auth/login')
    }

    const { token } = req.body

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
    })

    if (!verified) {
      return res.render('twoFA/verify', { error: 'Неверный код!' })
    }

    req.session.is2FAAuthenticated = true
    res.redirect('/dashboard')
  } catch (err) {
    console.error('Ошибка при проверке 2FA:', err)
    return res.render('twoFA/verify', { error: 'Ошибка при проверке 2FA' })
  }
}
