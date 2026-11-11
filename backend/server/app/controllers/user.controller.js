const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = db.users

// 1. Créer un nouvel utilisateur avec mot de passe haché
exports.create = async (req, res) => {
  const fullname = req.body.fullname || req.body.user_name
  const email = req.body.email || req.body.user_email
  const password = req.body.password || req.body.user_password

  if (!fullname || !email || !password) {
    return res.status(400).send({
      message: 'Full name, email and password are required.'
    })
  }

  try {
    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      fullname: fullname,
      email: email,
      password: hashPassword
    })

    // Retourner l'utilisateur créé sans le mot de passe
    const { password: _, ...userData } = user.toJSON()
    res.status(201).send(userData)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Error occurred while creating the user.'
    })
  }
}

// 2. Connexion (Login)
exports.findOne = async (req, res) => {
  const email = req.body.email || req.body.user_email
  const password = req.body.password || req.body.user_password

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required.' })
  }

  try {
    // Recherche par le vrai nom de colonne user_email
    const user = await User.findOne({ where: { user_email: email } })

    if (!user) {
      return res.status(400).send({ message: 'User not found.' })
    }

    // Gestion du mot de passe : compare avec bcrypt ou repli temporaire si en clair
    let isPasswordValid = false
    if (user.user_password.startsWith('$2')) {
      isPasswordValid = await bcrypt.compare(password, user.user_password)
    } else {
      // Pour les comptes créés manuellement en clair dans la BDD
      isPasswordValid = (password === user.user_password)
    }

    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Invalid password.' })
    }

    // Génération du JWT avec la vraie clé user_id
    const token = jwt.sign({ id: user.user_id }, 'secret', { expiresIn: '1d' })

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    const userData = {
      id: user.user_id,
      fullname: user.user_name,
      email: user.user_email,
      dashboard_id: user.dashboard_id
    }

    res.send({
      message: 'Login successful.',
      user: userData,
      token: token
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: err.message || 'Error during login.'
    })
  }
}

// 3. Vérification de session
exports.auth = async (req, res) => {
  try {
    const cookie = req.cookies['jwt']
    if (!cookie) return res.status(401).send({ message: 'Unauthenticated' })

    const claims = jwt.verify(cookie, 'secret')
    const user = await User.findByPk(claims.id)

    if (!user) return res.status(401).send({ message: 'User not found' })

    res.send({
      id: user.user_id,
      fullname: user.user_name,
      email: user.user_email,
      dashboard_id: user.dashboard_id
    })
  } catch (err) {
    return res.status(401).send({ message: 'Unauthenticated' })
  }
}


// 4. Déconnexion (Suppression du cookie)
exports.logout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 })
  res.send({ message: 'Logout successful.' })
}

// 5. Lister tous les utilisateurs (optionnel)
exports.findAll = (req, res) => {
  User.findAll({ attributes: { exclude: ['password'] } })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message || 'Error fetching users.' }))
}