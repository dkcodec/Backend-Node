// Import required modules
const express = require('express') // Express framework for creating the server
const bodyParser = require('body-parser') // Middleware for parsing form data

// Initialize the app
const app = express()

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })) // Parse URL-encoded form data
app.use(express.static('public')) // Serve static files (like CSS) from the 'public' folder

// Route for the home page
app.get('/', (req, res) => {
  // Serve the index.html file when the user accesses the root URL
  res.sendFile(__dirname + '/views/index.html')
})

// Route for handling the form submission
app.post('/greet', (req, res) => {
  // Retrieve the 'name' field value from the submitted form
  const name = req.body.name

  // Send a personalized greeting as the response
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Greeting</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Your Personalized Greeting</h1>
            <p>Hello, ${name}! Nice to meet you!</p>
            <a href="/">Go back</a> 
        </body>
        </html>
    `)
})

// Start the server
const PORT = 3000 // Define the port number
app.listen(PORT, () => {
  // Log a message when the server starts
  console.log(`Server is running on http://localhost:${PORT}`)
})
