const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    // validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .render('register', { error: 'All fields are required' })
    }

    // check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(401).render('register', {
        error: 'User with this email or username already exists',
      })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()

    return res.redirect('/login')
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .render('login', { error: 'All fields are required' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).render('login', { error: 'Invalid email' })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).render('login', { error: 'Invalid password' })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    return res.redirect('/tasks')
  } catch (error) {
    next(error)
  }
}
