const Blog = require('../models/blogs')
const User = require('../models/users')

const initialBlogs = [
  {
    title: 'Hunter x hunter',
    author: 'Yoshihiro Togashi',
    url: 'https://es.wikipedia.org/wiki/Hunter_%C3%97_Hunter',
    likes: 5
  },
  {
    title: 'Yu yu hakusho',
    author: 'Yoshihiro Togashi',
    url: 'https://es.wikipedia.org/wiki/Y%C5%AB_Y%C5%AB_Hakusho',
    likes: 10
  },
  {
    title: 'Tokyo ghoul',
    author: 'Sui Ishida',
    url: 'https://es.wikipedia.org/wiki/Tokyo_Ghoul',
    likes: 20
  }
]

const initialUsers = [
  {
    username: 'root',
    password: 'sekret'
  },
  {
    username: 'bad_user',
    password: 'bad_request'
  }
]


const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { initialBlogs, initialUsers, blogsInDB, usersInDB }
