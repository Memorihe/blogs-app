const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acum, blog) => acum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  let favoriteBlog = blogs[0]
  for (const blog of blogs) {
    if (blog.likes > favoriteBlog.likes) favoriteBlog = blog
  }

  return favoriteBlog
}

const mostBlogs = (blogs) => {
  const groupAuthor = _.countBy(blogs, 'author')
  let result = { author: '', blogs: 0 }
  _.forEach(groupAuthor, (blogs, author) => {
    if (result.blogs < blogs) result = { author, blogs }
  })

  return result
}

const mostLikes = (blogs) => {
  const groupAuthor = _.groupBy(blogs, 'author')

  let result = { author: '', likes: 0 }
  _.forEach(groupAuthor, (blogs, author) => {
    const likes = blogs.reduce((acum, blog) => acum + blog.likes, 0)
    if (result.likes < likes) result = { author, likes }
  })

  return result
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
