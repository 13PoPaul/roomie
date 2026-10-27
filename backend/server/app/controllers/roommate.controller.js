const db = require('../models')
const Roommate = db.roommates

// Create and Save a new Roommate
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: 'The name is mandatory.'
    })
    return
  }

  // Create a Roommate object
  const roommate = {
    name: req.body.name,
    email: req.body.email,
    room: req.body.room,
    phone: req.body.phone
  }

  // Save to database
  Roommate.create(roommate)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error occurred while creating the roommate.'
      })
    })
}

// Retrieve all Roommates from the database
exports.findAll = (req, res) => {
  Roommate.findAll()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error occurred while retrieving roommates.'
      })
    })
}

// Find a single Roommate by ID
exports.findOne = (req, res) => {
  const id = req.params.id

  Roommate.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find roommate with id=${id}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving roommate with id=${id}.`
      })
    })
}

// Update a Roommate by ID
exports.update = (req, res) => {
  const id = req.params.id

  Roommate.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Roommate was updated successfully.'
        })
      } else {
        res.send({
          message: `Cannot update roommate with id=${id}. Maybe roommate was not found or req.body is empty.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating roommate with id=${id}.`
      })
    })
}

// Delete a Roommate by ID
exports.delete = (req, res) => {
  const id = req.params.id

  Roommate.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Roommate was deleted successfully.'
        })
      } else {
        res.send({
          message: `Cannot delete roommate with id=${id}. Maybe roommate was not found.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete roommate with id=${id}.`
      })
    })
}