import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectTheme, setTheme } from '../store/themeSlice'

export default function ThemeToggle(){
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()

  function toggle(){
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <button onClick={toggle} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none"><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </button>
  )
}
