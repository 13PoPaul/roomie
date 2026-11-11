const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const db = require('../models')
const Dashboard = db.dashboards
const User = db.users

// Génère un code unique (ex: "ROOMIE-E4B1F8") autorisé par le VARCHAR(20)
function generateInvitationCode() {
  return 'ROOMIE-' + crypto.randomBytes(3).toString('hex').toUpperCase()
}

// 1. Créer un nouveau Dashboard

exports.create = async (req, res) => {
  const name = req.body.dashboard_name || req.body.name

  if (!name?.trim()) {
    return res.status(400).send({
      message: 'Dashboard name is required.'
    })
  }

  // Identifier l'utilisateur connecté
  let userId

  try {
    const token = req.cookies?.jwt
    if (!token) {
      return res.status(401).send({
        message: 'Please log in first.'
      })
    }

    const claims = jwt.verify(token, 'secret')
    userId = claims.id
  } catch {
    return res.status(401).send({
      message: 'Invalid or expired session.'
    })
  }

  try {
    const code =
      req.body.invitation_code ||
      req.body.code ||
      generateInvitationCode()

    // Les deux opérations doivent réussir ensemble
    const dashboard = await db.connex.transaction(async (transaction) => {
      const user = await User.findByPk(userId, { transaction })

      if (!user) {
        throw new Error('User not found.')
      }

      const createdDashboard = await Dashboard.create({
        dashboard_name: name.trim(),
        invitation_code: code
      }, { transaction })

      await user.update({
        dashboard_id: createdDashboard.dashboard_id
      }, { transaction })

      return createdDashboard
    })

    return res.status(201).send(dashboard)

  } catch (err) {
    console.error('Error creating dashboard:', err)

    return res.status(500).send({
      message: 'Error creating the dashboard.'
    })
  }
}


// 2. Rejoindre un Dashboard via son code d'invitation

exports.joinByCode = async (req, res) => {
  const code = req.body.invitation_code || req.body.code

  if (!code || typeof code !== 'string') {
    return res.status(400).send({
      message: 'Invitation code is required.'
    })
  }

  // Vérifier l'utilisateur connecté
  let userId

  try {
    const token = req.cookies?.jwt

    if (!token) {
      return res.status(401).send({
        message: 'Please log in first.'
      })
    }

    const claims = jwt.verify(token, 'secret')
    userId = claims.id
  } catch {
    return res.status(401).send({
      message: 'Invalid or expired session.'
    })
  }

  try {
    const dashboard = await Dashboard.findOne({
      where: {
        invitation_code: code.trim().toUpperCase()
      }
    })

    if (!dashboard) {
      return res.status(404).send({
        message: 'Invalid code. Dashboard not found.'
      })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).send({
        message: 'User not found.'
      })
    }

    // Un utilisateur ne peut appartenir qu'à un dashboard
    if (
      user.dashboard_id !== null &&
      user.dashboard_id !== dashboard.dashboard_id
    ) {
      return res.status(409).send({
        message: 'You already belong to another dashboard.'
      })
    }

    // Enregistrer le membre dans MySQL
    if (user.dashboard_id === null) {
      await user.update({
        dashboard_id: dashboard.dashboard_id
      })
    }

    return res.send(dashboard)

  } catch (err) {
    console.error('Error joining dashboard:', err)

    return res.status(500).send({
      message: 'Error joining the dashboard.'
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

// Récupérer tous les membres d'un dashboard donné
exports.findMembers = (req, res) => {
  const id = req.params.id

  Dashboard.findByPk(id, {
    include: [{
      model: db.users,
      as: 'members',
      attributes: ['user_id', 'user_name', 'user_email'] // On ne renvoie pas le mot de passe
    }]
  })
    .then(data => {
      if (!data) return res.status(404).send({ message: 'Dashboard not found.' })
      res.send(data.members)
    })
    .catch(err => {
      res.status(500).send({ message: err.message || 'Error fetching members.' })
    })
}