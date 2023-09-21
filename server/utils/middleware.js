const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return response.status(400).json({ error: error.message })
    case 'Unauthorized':
      return response
        .status(401)
        .json({ error: 'invalid username or password' })
    case 'JsonWebTokenError':
      return response.status(401).json({ error: 'Invaled token' })
    case 'TokenExpiredError':
      return response.status(401).json({ error: 'Token expired' })
  }

  next(error)
}

const userAuthentication = (request, response, next) => {
  const authorization = request.get('authorization')
  const token =
    authorization && authorization.toLowerCase().startsWith('bearer ')
      ? authorization.substring(7)
      : null
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return next({ name: 'Unauthorized' })
  }

  request.userId = decodedToken.id

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userAuthentication
}
