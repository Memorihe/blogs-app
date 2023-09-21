const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')

const Blog = require('../models/blogs')
const User = require('../models/users')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

const api = supertest(app)
const API_URI = '/api/blogs'
let userAccess = []
let usersInDB = []
let rootToken = ''
let badToken = ''

beforeAll(async () => {
  await User.deleteMany({})
  const promiseUsers = await helper.initialUsers.map((user) =>
    api.post('/api/users').send(user)
  )
  const responseUsers = await Promise.all(promiseUsers)

  usersInDB = await responseUsers.map(({ body }) => body)

  const promiseToken = await helper.initialUsers.map((user) =>
    api.post('/api/login').send(user)
  )
  const responseToken = await Promise.all(promiseToken)
  userAccess = await responseToken.map(({ body }) => body)

  rootToken = `Bearer ${userAccess[0].token}`
  badToken = `Bearer ${userAccess[1].token}`
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogsObject = await helper.initialBlogs.map(
    (b) => new Blog({ ...b, user: usersInDB[0].id })
  )
  const promiseArray = await blogsObject.map((b) => b.save())
  await Promise.all(promiseArray)
})

describe('get all blogs', () => {
  test('get api should be returned as json', async () => {
    await api
      .get(API_URI)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get api should be return id', async () => {
    const response = await api.get(API_URI)
    expect(response.body[0].id).toBeDefined()
  })

  test('get api should returned all blogs', async () => {
    const blogsInDb = await helper.blogsInDB()
    const { body } = await api.get(API_URI)
    expect(body).toHaveLength(blogsInDb.length)
  })
})

describe('get blog by id', () => {
  test('get by id should returned as json', async () => {
    const blogDB = await helper.blogsInDB()
    const { id } = blogDB[0]
    await api
      .get(`${API_URI}/${id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get api should returned id', async () => {
    const blogDB = await helper.blogsInDB()
    const { id } = blogDB[0]
    const { body } = await api.get(`${API_URI}/${id}`)
    expect(body.id).toBeDefined()
  })
})

describe('post a new blog', () => {
  test('post a blog with an invalid token, should returned error 401', async () => {
    const newBlog = {
      title: 'Jujutsu Kaisen',
      author: 'Gege Akutami'
    }

    await api
      .post(API_URI)
      .set('Authorization', 'bearer bad_password10234574asda')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('add a blog without likes, should save likes equals 0', async () => {
    const newBlog = {
      title: 'Jujutsu Kaisen',
      author: 'Gege Akutami',
      url: 'https://es.wikipedia.org/wiki/Jujutsu_Kaisen'
    }

    const { body } = await api
      .post(API_URI)
      .set('Authorization', rootToken)
      .send(newBlog)
      .expect(200)

    expect(body.likes).toBe(0)
  })

  test('add a blog without title or URL, should return state 400', async () => {
    const { status } = await api
      .post(API_URI)
      .set('Authorization', rootToken)
      .send({ content: 'Gran arbol', author: 'Jose', likes: 2 })
    expect(status).toBe(400)
  })
})

test('dummy return one', () => {
  const result = listHelper.dummy([])
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has not blogs, equals to 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([helper.initialBlogs[0]])
    expect(result).toBe(5)
  })

  test('when list has many blogs, equals the sum of all', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(35)
  })
})

describe('favorite blog', () => {
  test('should return title, author, likes of tokyo ghoul', () => {
    const favoriteBlog = listHelper.favoriteBlog(helper.initialBlogs)
    expect(favoriteBlog.title).toEqual('Tokyo ghoul')
  })
})

describe('most blogs', () => {
  test('when list has many blogs, equals group blogs by author', () => {
    const result = listHelper.mostBlogs(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Yoshihiro Togashi',
      blogs: 2
    })
  })
})

describe('most likes', () => {
  test('when list has many blogs, equals group likes by author', () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Sui Ishida',
      likes: 20
    })
  })
})

describe('delete a blog', () => {
  test('if get a invalid token, should returned 401 and not delete de record', async () => {
    const blogsInDB = await helper.blogsInDB()
    const blogId = blogsInDB[0].id
    await api.delete(`${API_URI}/${blogId}`).expect(401)

    const newBlogs = await helper.blogsInDB()
    expect(newBlogs).toHaveLength(helper.initialBlogs.length)
  })

  test('if get a valid token but user isnt the creator, should returned 401 and not deleted de record', async () => {
    const blogsInDB = await helper.blogsInDB()
    const blogId = blogsInDB[0].id
    await api
      .delete(`${API_URI}/${blogId}`)
      .set('Authorization', badToken)
      .expect(401)

    const newBlogs = await helper.blogsInDB()
    expect(newBlogs).toHaveLength(helper.initialBlogs.length)
  })

  test('if get a valid token and it is the blog creator, should returned 200 and deleted de record', async () => {
    const blogsInDB = await helper.blogsInDB()
    const blogId = blogsInDB[0].id
    await api
      .delete(`${API_URI}/${blogId}`)
      .set('Authorization', rootToken)
      .expect(200)

    const newBlogs = await helper.blogsInDB()
    expect(newBlogs).toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('update a blog', () => {
  test('if dont set token, should returned 401 and dont update the blog', async () => {
    const blogs = await helper.blogsInDB()
    const blogId = blogs[0].id
    
    await api
      .put(`${API_URI}/${blogId}`)
      .send({ title: 'new title' })
      .expect(401)

      const blogInDB = await helper.blogsInDB()
      expect(blogInDB[0].title).toEqual(blogs[0].title)
  })

  test('if another user try to update a blog, should returned 401 and dont update', async () => {
    const blogs = await helper.blogsInDB()
    const blogId = blogs[0].id
    
    await api
      .put(`${API_URI}/${blogId}`)
      .set('Authorization', badToken)
      .send({ title: 'new title' })
      .expect(401)

      const blogInDB = await helper.blogsInDB()
      expect(blogInDB[0].title).toEqual(blogs[0].title)
  })

  test('if original user try to update a blog, should returned 200 and update', async () => {
    const blogs = await helper.blogsInDB()
    const blogId = blogs[0].id
    
    await api
      .put(`${API_URI}/${blogId}`)
      .set('Authorization', rootToken)
      .send({ title: 'new title' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const blogInDB = await helper.blogsInDB()
      expect(blogInDB[0].title).toEqual('new title')
  })
})

afterAll(() => mongoose.connection.close())
