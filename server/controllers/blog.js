const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post(
  '/',
  middleware.userAuthentication,
  async (request, response, next) => {
    const body = request.body
    const userId = request.userId

    if (!body.title || !body.url)
      return next({
        name: 'ValidationError',
        message: 'The title and URL are required'
      })

    const user = await User.findById(userId)
    if (!user) return next({ name: 'Unauthorized' })

    const newBlog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes | 0,
      user: user.id
    })

    const blog = await newBlog.save()

    user.blogs = user.blogs.concat(blog.id)
    await user.save()

    response.json(blog)
  }
)

blogsRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params
  const blogs = await Blog.findById(id)
  response.json(blogs)
})

blogsRouter.delete('/:id', middleware.userAuthentication, async (request, response, next) => {
    const { id } = request.params
    const userId = request.userId
    const user = await User.findById(userId)
    if (!user) return next({ name: 'Unauthorized' })
    const blog = await Blog.findById(id)
    if (blog.user.toString() !== userId.toString()) return next({ name: 'Unauthorized' })

    await Blog.findByIdAndDelete(id)
    
    response.status(200).end()
  }
)

blogsRouter.put('/:id', middleware.userAuthentication, async (request, response, next) => {
  const { id } = request.params
  const body = request.body
  const userId = request.userId

  const blog = await Blog.findById(id)  
  if (blog.user.toString() !== userId.toString()) return next({ name: 'Unauthorized'})

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userId
  } 

  const blogRes = await Blog.findByIdAndUpdate(id, newBlog, { new: true })
  response.json(blogRes)
})

module.exports = blogsRouter
