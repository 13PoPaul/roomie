const crypto = require('crypto')
const db = require('../models')
const Room = db.rooms

// Fonction utilitaire pour générer un code court unique (ex: "E4B1F8")
function generateRoomCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase()
}

// Créer une nouvelle Room
exports.create = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ message: 'Room name is required.' })
  }

  try {
    const code = generateRoomCode()
    const room = await Room.create({
      name: req.body.name,
      code: code
    })
    res.send(room)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Error creating the room.'
    })
  }
}

// Rejoindre une Room existante avec son code
exports.joinByCode = async (req, res) => {
  const { code } = req.body

  if (!code) {
    return res.status(400).send({ message: 'Room code is required.' })
  }

  try {
    const room = await Room.findOne({ where: { code: code.trim().toUpperCase() } })
    if (!room) {
      return res.status(404).send({ message: 'Invalid code. Room not found.' })
    }
    res.send(room)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Error finding the room.'
    })
  }
}

// Obtenir les détails d'une Room par son ID
exports.findOne = (req, res) => {
  const id = req.params.id

  Room.findByPk(id)
    .then(data => {
      if (data) res.send(data)
      else res.status(404).send({ message: `Room with id=${id} not found.` })
    })
    .catch(err => {
      res.status(500).send({ message: `Error retrieving room with id=${id}.` })
    })
}