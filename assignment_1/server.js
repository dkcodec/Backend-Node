const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const PORT = 3000

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

// Обработка формы и отправка результата
app.post('/calculate', (req, res) => {
  const { weight, height, age, gender } = req.body

  // Check for invalid input
  if (!weight || !height || weight <= 0 || height <= 0) {
    return res.send(`
            <h1>Error</h1>
            <p>Invalid input. Please enter valid weight and height values.</p>
            <a href="/">Go Back</a>
        `)
  }

  // Calculate BMI
  const bmi = (weight / (height * height)).toFixed(2)

  // Categorize BMI and provide health tips
  let category = ''
  let tips = ''
  if (bmi < 18.5) {
    category = 'Underweight'
    tips = 'Eat a balanced diet and increase caloric intake.'
  } else if (bmi < 25) {
    category = 'Normal weight'
    tips = 'Maintain your current lifestyle and exercise regularly.'
  } else if (bmi < 30) {
    category = 'Overweight'
    tips = 'Incorporate regular exercise and monitor your diet.'
  } else {
    category = 'Obesity'
    tips = 'Consult a healthcare professional for guidance.'
  }

  // Generate the result
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Result</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>BMI Result</h1>
            <p>Your BMI: <strong>${bmi}</strong></p>
            <p>Category: <strong>${category}</strong></p>
            <p>Health Tips: <strong>${tips}</strong></p>
            <a href="/">Go Back</a>
        </body>
        </html>
    `)
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
