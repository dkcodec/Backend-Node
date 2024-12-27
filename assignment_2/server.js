require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()
const PORT = 3000

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// Spotify API setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

// Fetch Access Token
spotifyApi.clientCredentialsGrant().then(
  (data) => {
    spotifyApi.setAccessToken(data.body['access_token'])
  },
  (err) => {
    console.error('Error retrieving access token', err)
  }
)

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post('/search', (req, res) => {
  const query = req.body.query

  spotifyApi.searchTracks(query).then(
    (data) => {
      const tracks = data.body.tracks.items.map((track) => ({
        name: track.name,
        artists: track.artists.map((artist) => artist.name).join(', '),
        album: track.album.name,
        link: track.external_urls.spotify,
        image: track.album.images[0]?.url,
        releaseDate: track.album.release_date,
        popularity: track.popularity,
        explicit: track.explicit,
        preview_url: track.preview_url,
      }))

      res.json(tracks)
    },
    (err) => {
      console.error('Error fetching tracks', err)
      res.status(500).send('Error fetching tracks')
    }
  )
})

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
