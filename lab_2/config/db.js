const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb://localhost:27017/lab_2'

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB подключена успешно!'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err))
