import { createSlice } from '@reduxjs/toolkit'

const initial = localStorage.getItem('theme') || 'light'

if (typeof document !== 'undefined') {
  if (initial === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initial },
  reducers: {
    setTheme(state, action){
      state.mode = action.payload
      localStorage.setItem('theme', action.payload)
      if(action.payload === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  }
})

export const { setTheme } = themeSlice.actions
export const selectTheme = state => state.theme.mode
export default themeSlice.reducer
