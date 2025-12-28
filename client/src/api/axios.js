import axios from 'axios'
import store from '../store'
import { setCredentials, clearCredentials } from '../store/authSlice'

const api = axios.create({ baseURL: 'http://localhost:4000' })

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.request.use(config => {
  const state = store.getState()
  const token = state.auth.access
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

api.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const state = store.getState()
    const refreshToken = state.auth.refresh || localStorage.getItem('refresh')
    if (!refreshToken) {
      store.dispatch(clearCredentials())
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token
        return api(originalRequest)
      }).catch(err => Promise.reject(err))
    }

    isRefreshing = true
    try {
      const res = await axios.post('http://localhost:4000/api/auth/refresh', { refresh: refreshToken })
      const { access, refresh } = res.data
      store.dispatch(setCredentials({ user: JSON.parse(localStorage.getItem('user') || 'null'), access, refresh }))
      processQueue(null, access)
      originalRequest.headers['Authorization'] = 'Bearer ' + access
      return api(originalRequest)
    } catch (err) {
      processQueue(err, null)
      store.dispatch(clearCredentials())
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
  return Promise.reject(error)
})

export default api
