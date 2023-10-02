import axios from 'axios'

let token = null

export const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

export const addBlog = (newBlog) => {
    const config = {
        headers: {
            Authorization: token
        }
    }
    return axios.post('http://localhost:3001/api/blogs', newBlog, config)
}

export const getBlogs = () => {
    return axios.get('http://localhost:3001/api/blogs')
}