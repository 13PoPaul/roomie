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

// Import des 4 modèles
db.dashboards = require('./dashboard.model.js')(connex, Sequelize)
db.users = require('./user.model.js')(connex, Sequelize)
db.tasks = require('./task.model.js')(connex, Sequelize)


// --- RELATIONS CONFORMES À L'ERD / MLD ---

// 1. BELONGS_TO : User (0,1) <---> (1,n) Dashboard
db.dashboards.hasMany(db.users, { as: 'members', foreignKey: 'dashboard_id' })
db.users.belongsTo(db.dashboards, { as: 'dashboard', foreignKey: 'dashboard_id' })

// 2. CONTAINS : Dashboard (0,n) <---> (1,1) Task
db.dashboards.hasMany(db.tasks, { as: 'tasks', foreignKey: 'dashboard_id' })
db.tasks.belongsTo(db.dashboards, { as: 'dashboard', foreignKey: 'dashboard_id' })

// 3. IS_ASSIGNED_TO : Relation N:M entre User et Task
db.users.belongsToMany(db.tasks, { through: 'is_assigned_to', foreignKey: 'user_id', otherKey: 'task_id' })
db.tasks.belongsToMany(db.users, { through: 'is_assigned_to', foreignKey: 'task_id', otherKey: 'user_id' })

module.exports = db