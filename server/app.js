const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blog')

logger.info(`Connecting to database...`)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Database connected'))
  .catch((err) => logger.error(err))

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
