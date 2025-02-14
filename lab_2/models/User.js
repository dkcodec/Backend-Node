const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  twoFASecret: {
    type: String,
    default: null,
  },
  is2FAEnabled: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('User', userSchema)
