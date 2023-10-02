import { useEffect, useState } from 'react'
import { setToken } from '../services/blog'
import { login } from '../services/login'

const INIT_USER = { username: '', password: '' }
export const useLogin = () => {
  const [userForm, setUserForm] = useState(INIT_USER)
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('user')
    if (loggedUser) {
      const storageUser = JSON.parse(loggedUser)
      setUser(storageUser)
      setToken(storageUser.token)
    }
  },[])

  const logout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const handleUser = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    login(userForm)
      .then(({ data }) => {
        window.localStorage.setItem('user', JSON.stringify(data))
        setUser(data)
        setToken(data.token)
        setUserForm(INIT_USER)
      })
      .catch((e) => setLoginError({text: 'Wrong credentials!', color: 'red'}))
  }

  return { user, userForm, handleUser, handleLogin, logout, loginError }
}
