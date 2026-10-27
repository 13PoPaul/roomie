const dbConfig = require('../config/db.config.js')
const Sequelize = require('sequelize')

const connex = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: 3306,
  operatorAliases: false
})

const db = {}
db.Sequelize = Sequelize
db.connex = connex

// Import des modèles
db.rooms = require('./room.model.js')(connex, Sequelize)
db.users = require('./user.model.js')(connex, Sequelize)
db.tasks = require('./task.model.js')(connex, Sequelize)

// --- RELATIONS ---

// 1. Une Colocation a plusieurs Utilisateurs, un Utilisateur a au maximum une Colocation
db.rooms.hasMany(db.users, { as: 'members' })
db.users.belongsTo(db.rooms, { as: 'room', foreignKey: 'roomId' })

// 2. Une Colocation possède plusieurs Tâches, une Tâche appartient à une Colocation
db.rooms.hasMany(db.tasks, { as: 'tasks' })
db.tasks.belongsTo(db.rooms, { as: 'room', foreignKey: 'roomId' })

// 3. Assignation des Tâches : relation N:M entre Users et Tasks
db.users.belongsToMany(db.tasks, { through: 'user_tasks' })
db.tasks.belongsToMany(db.users, { through: 'user_tasks' })

module.exports = db