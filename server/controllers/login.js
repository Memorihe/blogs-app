const loginRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body
  
  if (!username || !password) return next({ name: 'Unauthorized' })

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!passwordCorrect) return next({ name: 'Unauthorized' })

  const userToken = { username: user.username, id: user._id }

  const token = await jwt.sign(userToken, process.env.SECRET, {expiresIn: 60*60})

  response.status(200).send({ token: token, username: user.username, name: user.name })
})

module.exports = loginRouter
