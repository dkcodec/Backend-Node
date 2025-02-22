const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.getProfile = async (req, res, next) => {
  try {
    // req.user will be available thanks to authMiddleware
    const userId = req.user.userId
    const user = await User.findById(userId).select('-password') // exclude password

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json(user)
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
      return res.status(404).json({ error: 'user not found' })
    }

    if (username) user.username = username
    if (email) user.email = email
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    await user.save()
    return res.status(200).json({ message: 'Profile updated!' })
  } catch (error) {
    next(error)
  }
}
