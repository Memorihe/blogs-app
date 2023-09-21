const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/users')

const API_URI = '/api/users'

beforeEach(async () => {
  await User.deleteMany({})
  await api.post(API_URI).send({ username: 'root', password: 'sekret' })
})

describe('get all', () => {
  test('get users, should returned status 200 and JSON', async () => {
    await api
      .get(API_URI)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get users, should returned the id param', async () => {
    const { body } = await api.get(API_URI)
    expect(body[0].id).toBeDefined()
  })

  test('get users, should not returned the password param', async () => {
    const { body } = await api.get(API_URI)
    expect(body[0].password).not.toBeDefined()
  })
})

describe('post', () => {
  test('post user without username, should returned error 400', async () => {
    await api.post(API_URI).send({ name: 'Jose', password: '0000' }).expect(400)

    const users = await User.find({})
    expect(users).toHaveLength(1)
  })

  test('post user without password, should returned error 400', async () => {
    await api
      .post(API_URI)
      .send({ username: 'dragon', name: 'Jose' })
      .expect(400)

    const users = await User.find({})
    expect(users).toHaveLength(1)
  })

  test('post user, should returned 200 and increment by one collection', async () => {
    await api
      .post(API_URI)
      .send({ username: 'dragon', name: 'Jose', password: '0000' })
      .expect(200)

    const users = await User.find({})
    expect(users).toHaveLength(2)

    const usersName = await users.map((u) => u.username)
    expect(usersName).toContain('dragon')
  })
})
