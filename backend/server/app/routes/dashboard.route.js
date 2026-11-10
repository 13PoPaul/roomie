module.exports = app => {
  const dashboard = require('../controllers/dashboard.controller.js')
  const router = require('express').Router()

  router.post('/', dashboard.create)
  router.post('/join', dashboard.joinByCode)
  router.get('/:id', dashboard.findOne)
  router.get('/:id/users', dashboard.findMembers)

  app.use('/api/dashboards', router)
}