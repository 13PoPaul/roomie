module.exports = app => {
  const tasks = require('../controllers/task.controller.js')
  const router = require('express').Router()

  // Retrieve all tasks
  router.get('/', tasks.findAll)

  // Create a new task
  router.post('/', tasks.create)

  // Retrieve a single task with id
  router.get('/:id', tasks.findOne)

  // Update a task with id
  router.put('/:id', tasks.update)

  // Delete a task with id
  router.delete('/:id', tasks.delete)

  // Mount router under /api/tasks
  app.use('/api/tasks', router)
}