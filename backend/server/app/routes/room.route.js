module.exports = app => {
  const rooms = require('../controllers/room.controller.js')
  const router = require('express').Router()

  // Créer une colocation
  router.post('/', rooms.create)

  // Rejoindre avec un code
  router.post('/join', rooms.joinByCode)

  // Obtenir les infos d'une colocation
  router.get('/:id', rooms.findOne)

  app.use('/api/rooms', router)
}