import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  access: localStorage.getItem('access') || null,
  refresh: localStorage.getItem('refresh') || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action){
      const { user, access, refresh } = action.payload
      state.user = user
      state.access = access
      state.refresh = refresh
      if(user) localStorage.setItem('user', JSON.stringify(user))
      if(access) localStorage.setItem('access', access)
      if(refresh) localStorage.setItem('refresh', refresh)
    },
    clearCredentials(state){
      state.user = null
      state.access = null
      state.refresh = null
      localStorage.removeItem('user')
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    }
  }
})

export const { setCredentials, clearCredentials } = authSlice.actions

export const selectCurrentUser = state => state.auth.user
export const selectAccessToken = state => state.auth.access
export const selectRefreshToken = state => state.auth.refresh

export default authSlice.reducer
