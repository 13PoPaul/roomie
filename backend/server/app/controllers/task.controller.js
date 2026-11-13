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
    .then(async createdTask => {
      // Si un user_id a été sélectionné dans le formulaire
      if (req.body.user_id) {
        await createdTask.setUsers([req.body.user_id]) // Remplit la table pivot is_assigned_to
      }
      res.send(createdTask)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error occurred while creating the task.'
      })
    })
}

// 2. Récupérer toutes les tâches (la fonction qui manquait)
exports.findAll = (req, res) => {
  const dashboardId = req.query.dashboard_id || req.query.roomId
  const condition = dashboardId ? { dashboard_id: dashboardId } : null

  Task.findAll({
    where: condition,
    include: [{
      model: db.users,
      attributes: ['user_id', 'user_name'],
      through: { attributes: [] } // Masque les colonnes techniques de is_assigned_to
    }]
  })
    .then(data => {
      res.send(data)
    })
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

exports.update = async (req, res) => {
  const id = req.params.id

  try {
    const task = await Task.findByPk(id)

    if (!task) {
      return res.status(404).send({
        message: `Cannot find task with id=${id}.`
      })
    }

    const payload = {
      ...(req.body.title !== undefined && { task_title: req.body.title }),
      ...(req.body.description !== undefined && { task_description: req.body.description }),
      ...(req.body.location !== undefined && { task_location: req.body.location }),
      ...(req.body.dueDate !== undefined && { task_duedate: req.body.dueDate }),
      ...(req.body.priority !== undefined && { task_priority: req.body.priority }),
      ...(req.body.status !== undefined && { task_status: req.body.status })
    }

    await db.connex.transaction(async (transaction) => {
      await task.update(payload, { transaction })

      // Modifier l'attribution seulement si user_id est fourni
      if (Object.prototype.hasOwnProperty.call(req.body, 'user_id')) {
        const userId = req.body.user_id

        if (userId !== null && userId !== '') {
          const user = await db.users.findByPk(userId, { transaction })

          if (!user || user.dashboard_id !== task.dashboard_id) {
            const error = new Error('User does not belong to this dashboard.')
            error.status = 400
            throw error
          }
        }

        await task.setUsers(
          userId === null || userId === '' ? [] : [userId],
          { transaction }
        )
      }
    })

    return res.send({
      message: 'Task was updated successfully.'
    })
  } catch (err) {
    console.error('Error updating task:', err)

    return res.status(err.status || 500).send({
      message: err.status ? err.message : 'Error updating task.'
    })
  }
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