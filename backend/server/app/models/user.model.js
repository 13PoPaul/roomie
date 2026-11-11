module.exports = (connex, Sequelize) => {
  const User = connex.define('user', {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    user_email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    user_password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    dashboard_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, { 
    tableName: 'users',
    timestamps: true 
  })

  return User
}