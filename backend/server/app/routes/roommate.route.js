module.exports = app => {
  const roommates = require('../controllers/roommate.controller.js')
  const router = require('express').Router()

  // Retrieve all roommates
  router.get('/', roommates.findAll)

  // Create a new roommate
  router.post('/', roommates.create)

  // Retrieve a single roommate by ID
  router.get('/:id', roommates.findOne)

  // Update a roommate by ID
  router.put('/:id', roommates.update)

  // Delete a roommate by ID
  router.delete('/:id', roommates.delete)

  // Base API path
  app.use('/api/roommates', router)
}