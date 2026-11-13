require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// 1. AJOUT : Import de cookie-parser
const cookieParser = require('cookie-parser')

const app = express()

// Allow requests from the Vue.js frontend
const corsOption = {
  origin: 'http://localhost:5173',
  credentials: true // Permet l'envoi des cookies sécurisés entre le front et le back
}
app.use(cors(corsOption))

// 2. AJOUT : Activation du parser de cookies AVANT les routes
app.use(cookieParser())

// Parse requests of content-type - application/json and application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Root / test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Roomie server.' })
})

// Register routes
require('./app/routes/task.route')(app)
require('./app/routes/dashboard.route')(app)
// 3. AJOUT : Enregistrement des routes d'authentification
require('./app/routes/user.route')(app)

// Set port and listen for requests
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

// Sync database models
const db = require('./app/models')
db.connex.sync()