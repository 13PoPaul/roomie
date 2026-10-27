module.exports = (connex, Sequelize) => {
  const ProgressNote = connex.define('progress_note', {
    note_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    note_content: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    note_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, { timestamps: true })

  return ProgressNote
}