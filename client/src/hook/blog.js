import { useEffect, useState } from 'react'
import { addBlog, getBlogs } from '../services/blog'

const INI_BLOG = {
  title: '',
  author: '',
  url: ''
}
export const useBlog = () => {
  const [newBlog, setNewBlog] = useState(INI_BLOG)
  const [blogs, setBlogs] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getBlogs().then(({ data }) => setBlogs(data))
  }, [])

  const handleBlog = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value })
  }

  const createBlog = (e) => {
    e.preventDefault()
    addBlog(newBlog)
      .then(({ data }) => {
        setNewBlog(INI_BLOG)
        setBlogs(blogs.concat(data))
        setMessage({text: `${data.title} by ${data.author} added`, color: 'green'})
      })
      .catch((e) => setMessage({text: 'Something was wrong!', color: 'red'}))
  }

  return { newBlog, handleBlog, createBlog, blogs, message }
}
