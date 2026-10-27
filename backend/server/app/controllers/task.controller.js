const db = require('../models')
const Task = db.tasks

// 1. Créer une nouvelle tâche
exports.create = (req, res) => {
  const title = req.body.task_title || req.body.title
  if (!title) {
    return res.status(400).send({ message: 'The title cannot be empty.' })
  }

  // Préparation de l'objet conforme aux colonnes MySQL de l'ERD
  const task = {
    task_title: title,
    task_description: req.body.task_description || req.body.description || null,
    task_location: req.body.task_location || req.body.location || null,
    task_duedate: req.body.task_duedate || req.body.dueDate || null,
    task_priority: req.body.task_priority || req.body.priority || 'medium',
    task_status: req.body.task_status || req.body.status || 'todo',
    dashboard_id: req.body.dashboard_id || req.body.roomId || null
  }

  Task.create(task)
    .then(data => res.send(data))
    .catch(err => {
      console.error(err)
      res.status(500).send({
        message: err.message || 'Error occurred while creating the task.'
      })
    })
}

// 2. Récupérer toutes les tâches (avec filtre par dashboard optionnel)
exports.findAll = (req, res) => {
  const dashboardId = req.query.dashboard_id || req.query.roomId
  const condition = dashboardId ? { dashboard_id: dashboardId } : null

  Task.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error occurred while retrieving tasks.'
      })
    })
}

// 3. Récupérer une seule tâche par son identifiant
exports.findOne = (req, res) => {
  const id = req.params.id

  Task.findByPk(id)
    .then(data => {
      if (data) res.send(data)
      else res.status(404).send({ message: `Cannot find task with id=${id}.` })
    })
    .catch(err => {
      res.status(500).send({ message: `Error retrieving task with id=${id}.` })
    })
}

// 4. Mettre à jour une tâche
exports.update = (req, res) => {
  const id = req.params.id

  const payload = {
    ...(req.body.title && { task_title: req.body.title }),
    ...(req.body.description && { task_description: req.body.description }),
    ...(req.body.location && { task_location: req.body.location }),
    ...(req.body.dueDate && { task_duedate: req.body.dueDate }),
    ...(req.body.priority && { task_priority: req.body.priority }),
    ...(req.body.status && { task_status: req.body.status }),
    ...req.body
  }

  Task.update(payload, {
    where: { task_id: id }
  })
    .then(num => {
      if (num == 1 || num[0] == 1) {
        res.send({ message: 'Task was updated successfully.' })
      } else {
        res.send({ message: `Cannot update task with id=${id}.` })
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Error updating task with id=${id}.` })
    })
}

// 5. Supprimer une tâche
exports.delete = (req, res) => {
  const id = req.params.id

  Task.destroy({
    where: { task_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: 'Task was deleted successfully.' })
      } else {
        res.send({ message: `Could not delete task with id=${id}.` })
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Could not delete task with id=${id}.` })
    })
}