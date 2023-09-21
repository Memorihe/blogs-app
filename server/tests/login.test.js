const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const API_URI = '/api/login'

test('not send username, should returned 401', async () => {
    await api
    .post(API_URI)
    .send({ password: 'sekret' })
    .expect(401)
})

test('not send password, should returned 401', async () => {
    await api
    .post(API_URI)
    .send({ username: 'root' })
    .expect(401)
})

test('Send correct username bad password, should returned 401', async () => {
    await api
    .post(API_URI)
    .send({ username: 'root', password: 'bad_password' })
    .expect(401)
})

test('Send correct username and password, should returned token', async () => {
    const { body } = await api
    .post(API_URI)
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(body.token).toBeDefined()
})
