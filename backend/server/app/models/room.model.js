module.exports = (connex, Sequelize) => {
  const Room = connex.define('room', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true // Empêche deux colocations d'avoir le même code d'invitation
    }
  })

  return Room
}