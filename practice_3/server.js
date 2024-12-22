// Import required modules
const express = require('express') // Framework for building web applications
const fetch = require('node-fetch') // To make API requests
const path = require('path') // To handle file paths

// Initialize the Express application
const app = express()

// Middleware to serve static files from the "public" directory
app.use(express.static('public'))

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }))

// Route for the home page
app.get('/', (req, res) => {
  // Send the "index.html" file as the response
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

// Route to handle form submission and fetch data from the Dog API
app.post('/results', async (req, res) => {
  // API URL to fetch a random dog image
  const apiUrl = 'https://dog.ceo/api/breeds/image/random'
  try {
    // Fetch data from the Dog API
    const apiResponse = await fetch(apiUrl)
    const apiData = await apiResponse.json() // Parse the response as JSON
    const dogImage = apiData.message // Extract the dog image URL

    // Send a dynamically generated HTML page with the dog image
    res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Random Dog</title>
                <link rel="stylesheet" href="/style.css"> <!-- Link to CSS file -->
            </head>
            <body>
                <h1>Random Dog Image</h1>
                <img src="${dogImage}" alt="Random Dog" /> <!-- Display the dog image -->
                <a href="/">Fetch Another Image</a> <!-- Link to fetch another image -->
            </body>
            </html>
        `)
  } catch (error) {
    // Handle errors if the API request fails
    res.status(500).send('Error fetching API data. Please try again.')
  }
})

// Route to fetch random advice from the Advice Slip API
app.get('/advice', async (req, res) => {
  const adviceApiUrl = 'https://api.adviceslip.com/advice'
  try {
    // Fetch data from the Advice Slip API
    const adviceApiResponse = await fetch(adviceApiUrl)
    const adviceApiData = await adviceApiResponse.json() // Parse the response as JSON
    const advice = adviceApiData.slip.advice // Extract the advice text

    // Send a dynamically generated HTML page with the advice
    res.send(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Random Advice</title>
                  <link rel="stylesheet" href="/style.css"> <!-- Link to CSS file -->
              </head>
              <body>
                  <h1>Random Advice</h1>
                  <p>${advice}</p> <!-- Display the random advice -->
                  <a href="/advice">Get Another Advice</a> <!-- Link to fetch another advice -->
                  <a href="/">Go Back Home</a> <!-- Link to go back home -->
              </body>
              </html>
          `)
  } catch (error) {
    // Handle errors if the API request fails
    res.status(500).send('Error fetching advice. Please try again.')
  }
})

// Define the port the server will listen on
const PORT = 3000
app.listen(PORT, () => {
  // Log a message indicating the server is running
  console.log(`Server running at http://localhost:${PORT}`)
})
