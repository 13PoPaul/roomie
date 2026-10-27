const crypto = require('crypto')
const db = require('../models')
const Dashboard = db.dashboards

// Génère un code unique (ex: "ROOMIE-E4B1F8") autorisé par le VARCHAR(20)
function generateInvitationCode() {
  return 'ROOMIE-' + crypto.randomBytes(3).toString('hex').toUpperCase()
}

// 1. Créer un nouveau Dashboard
exports.create = async (req, res) => {
  // Accepte indifféremment dashboard_name ou name envoyé par le frontend
  const name = req.body.dashboard_name || req.body.name

  if (!name) {
    return res.status(400).send({ message: 'Dashboard name is required.' })
  }

  try {
    const code = req.body.invitation_code || req.body.code || generateInvitationCode()

    const dashboard = await Dashboard.create({
      dashboard_name: name,
      invitation_code: code
    })

    res.send(dashboard)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Error occurred while creating the dashboard.'
    })
  }
}

// 2. Rejoindre un Dashboard via son code d'invitation
exports.joinByCode = async (req, res) => {
  const code = req.body.invitation_code || req.body.code

  if (!code) {
    return res.status(400).send({ message: 'Invitation code is required.' })
  }

  try {
    const dashboard = await Dashboard.findOne({
      where: { invitation_code: code.trim().toUpperCase() }
    })

    if (!dashboard) {
      return res.status(404).send({ message: 'Invalid code. Dashboard not found.' })
    }

    res.send(dashboard)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Error finding dashboard with this code.'
    })
  }
}

// 3. Obtenir les détails d'un Dashboard par son ID
exports.findOne = (req, res) => {
  const id = req.params.id

  Dashboard.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({ message: `Dashboard with id=${id} not found.` })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving dashboard with id=${id}.`
      })
    })
}