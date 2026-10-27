module.exports = (connex, Sequelize) => {
  const Task = connex.define('task', {
    title: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(200)
    },
    location: {
      type: Sequelize.STRING(50) // Cuisine, Salon, etc.
    },
    dueDate: {
      type: Sequelize.DATE
    },
    priority: {
      type: Sequelize.STRING(50),
      defaultValue: 'medium'
    },
    status: {
      type: Sequelize.STRING(50),
      defaultValue: 'pending' // pending, in-progress, completed
    }
  })

  return Task
}