module.exports = (connex, Sequelize) => {
  const Task = connex.define('task', {
    task_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    task_title: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    task_description: {
      type: Sequelize.STRING(200)
    },
    task_location: {
      type: Sequelize.STRING(50)
    },
    task_duedate: {
      type: Sequelize.DATE
    },
    task_priority: {
      type: Sequelize.STRING(50),
      defaultValue: 'medium'
    },
    task_status: {
      type: Sequelize.STRING(50),
      defaultValue: 'todo'
    }
  }, { timestamps: true })

  return Task
}