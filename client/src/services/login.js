import axios from 'axios'

export const login = (user) => {
    return axios.post('http://localhost:3001/api/login', user)
}