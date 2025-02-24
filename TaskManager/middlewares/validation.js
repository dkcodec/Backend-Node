const Joi = require('joi')
const Task = require('../models/Task')

//register validation
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username must not be empty',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 30 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Enter a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
})

//login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Enter a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
})

//task validation
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Task title must not be empty',
    'string.min': 'Task title must be at least 3 characters',
    'string.max': 'Task title must be at most 100 characters',
  }),
  description: Joi.string().max(500).allow('').messages({
    'string.max': 'Description must be at most 500 characters',
  }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .required()
    .messages({
      'any.only':
        "Status must be either 'pending', 'in_progress', or 'completed'",
    }),
})

//validation middleware
const validate = (schema, view) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false })

  if (error) {
    const errors = error.details.map((err) => err.message)
    let tasks = []
    const getTasks = async () => {
      if (res.locals.user.role === 'admin') {
        return (tasks = await Task.find({}))
      } else {
        return (tasks = await Task.find({ user: res.locals.user.userId }))
      }
    }
    getTasks()

    if (view) {
      if (view === 'tasks') {
        return res
          .status(400)
          .render(view, { errors, task: null, tasks, user: req.body })
      }
      return res.status(400).render(view, { errors, user: req.body })
    }

    return res.status(400).json({ errors })
  }

  next()
}
module.exports = {
  registerSchema,
  loginSchema,
  taskSchema,
  validate,
}
