const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// In-memory "database"
let items = []

// Set up EJS
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// ========================== ROUTES =========================== //

// 1. Read (GET all)
app.get('/', (req, res) => {
  res.render('index', { items })
})

// 2. Create (GET form page + POST form submission)
app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', (req, res) => {
  const { name, description } = req.body
  const newItem = { id: Date.now(), name, description }
  items.push(newItem)
  res.redirect('/')
})

// 3. Update (GET edit page + POST edit form)
app.get('/edit/:id', (req, res) => {
  const item = items.find((i) => i.id == req.params.id)
  res.render('edit', { item })
})

app.post('/edit/:id', (req, res) => {
  const { name, description } = req.body
  const item = items.find((i) => i.id == req.params.id)
  item.name = name
  item.description = description
  res.redirect('/')
})

// 4. Delete (POST delete request)
app.post('/delete/:id', (req, res) => {
  items = items.filter((i) => i.id != req.params.id)
  res.redirect('/')
})

// ============================================================= //

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
