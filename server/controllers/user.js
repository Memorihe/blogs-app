const usersRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')
const saltRounds = 10

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({})
  response.status(200).json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!username || !password)
    next({
      name: 'ValidationError',
      message: 'Username and password are required'
    })

  const hash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    password: hash
  })

  await user.save()
  response.status(200).json(user)
})

module.exports = usersRouter
