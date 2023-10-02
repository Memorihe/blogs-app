import './App.css'
import { Blog } from './components/blog'
import { BlogForm } from './components/blogForm'
import { Login } from './components/login'
import { Notification } from './components/notification'
import { useBlog } from './hook/blog'
import { useLogin } from './hook/login'

function App() {
  const { user, userForm, handleUser, handleLogin, logout, loginError } = useLogin()
  const { newBlog, handleBlog, createBlog, blogs, message } = useBlog()

  const loginForm = () => {
    return (
      <div>
        <Notification message={loginError} />
        <Login
          user={userForm}
          handleUser={handleUser}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  const blogList = () => {
    if (!blogs) return
    return (
      <div>
        <h3>user: {user.name}</h3>
        <button onClick={logout}>logout</button>
        <Notification message={message} />
        <BlogForm
          blog={newBlog}
          handleBlog={handleBlog}
          createBlog={createBlog}
        />
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    )
  }

  return (
    <div className='App'>
      <h1>Blogs app</h1>
      {!user && loginForm()}
      {user && blogList()}
    </div>
  )
}

export default App
