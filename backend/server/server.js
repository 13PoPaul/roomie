const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// Allow requests from the Vue.js frontend
const corsOption = {
  origin: 'http://localhost:5173',
  credentials: true
}
app.use(cors(corsOption))

// Parse requests of content-type - application/json and application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Root / test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Roomie server.' })
})

// Register routes
require('./app/routes/task.route')(app)
require('./app/routes/room.route')(app)

// Set port and listen for requests
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

// Sync database models
const db = require('./app/models')
db.connex.sync()