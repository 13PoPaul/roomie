const db = require('../models')
const Task = db.tasks

// Create and Save a new Task
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'The title cannot be empty.'
    })
    return
  }

  // Create Task object
  const task = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    dueDate: req.body.dueDate,
    priority: req.body.priority || 'medium',
    status: req.body.status || 'pending',
    roomId: req.body.roomId || null
  }

  // Save to database
  Task.create(task)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error occurred while creating the task.'
      })
    })
}

// Retrieve all Tasks
exports.findAll = (req, res) => {
  Task.findAll()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error occurred while retrieving tasks.'
      })
    })
}

// Find a single Task with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  Task.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find task with id=${id}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving task with id=${id}.`
      })
    })
}

// Update a Task by the id
exports.update = (req, res) => {
  const id = req.params.id

  Task.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Task was updated successfully.'
        })
      } else {
        res.send({
          message: `Cannot update task with id=${id}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating task with id=${id}.`
      })
    })
}

// Delete a Task with the specified id
exports.delete = (req, res) => {
  const id = req.params.id

  Task.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Task was deleted successfully.'
        })
      } else {
        res.send({
          message: `Cannot delete task with id=${id}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete task with id=${id}.`
      })
    })
}