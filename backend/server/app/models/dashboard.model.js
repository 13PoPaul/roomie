module.exports = (connex, Sequelize) => {
  const Dashboard = connex.define('dashboard', {
    dashboard_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dashboard_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    invitation_code: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
    }
  }, { timestamps: true })

  return Dashboard
}