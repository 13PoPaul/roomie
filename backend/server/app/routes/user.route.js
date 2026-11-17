module.exports = app => {
  const user = require('../controllers/user.controller.js')
  const router = require('express').Router()

  router.post('/', user.create)
  router.post('/login', user.findOne)
  router.get('/auth', user.auth)
  router.get('/logout', user.logout)
  router.put('/:id', user.update)

  app.use('/api/user', router)
}