const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => response.json(blogs))
})

blogsRouter.post('/', (request, response, next) => {
  const blog = request.body

  const newBlog = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  })

  blog
    .save()
    .then((savedBlog) => savedBlog.toJSON())
    .then((formatedBlog) => response.json(formatedBlog))
    .catch((err) => next(err))
})

blogsRouter.get('/:id', (request, response, next) => {
  const { id } = request.params
  Blog.findById(id)
    .then((blogs) => response.json(blogs))
    .catch((err) => next(err))
})

blogsRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params
  Blog.findByIdAndDelete(id)
    .then(() => response.status(200).end())
    .catch((err) => next(err))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const blog = request.body

  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }

  Blog.findByIdAndUpdate(id, newBlog, { new: true })
    .then((blog) => response.json(blog))
    .catch((err) => next(err))
})

module.exports = blogsRouter
