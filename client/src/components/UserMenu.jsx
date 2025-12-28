import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useDispatch } from 'react-redux'
import { clearCredentials } from '../store/authSlice'

export default function UserMenu({ user, subscription, onLogout }){
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  async function handleLogout(){
    const refresh = localStorage.getItem('refresh')
    try{ await api.post('/api/auth/logout', { refresh }) }catch(e){}
    dispatch(clearCredentials())
    onLogout?.()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
        <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">{(user?.name||'U').charAt(0)}</div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <div className="ml-2">
          <svg className={`w-4 h-4 transform ${open? 'rotate-180':''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded border">
          <div className="p-3 border-b">
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          <div className="p-2">
            <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link>
            {user?.role === 'admin' && <Link to="/admin/subscriptions" className="block p-2 rounded hover:bg-gray-100">Admin</Link>}
            <div className="p-2 flex items-center justify-between">
              <div className="text-sm">Subscription</div>
              <div className={`text-xs font-semibold ${subscription?.status==='active' ? 'text-green-600' : subscription?.status==='expired' ? 'text-red-600' : 'text-gray-600'}`}>
                {subscription ? subscription.status : 'none'}
              </div>
            </div>
            <button onClick={handleLogout} className="mt-2 w-full text-left text-sm text-red-600 p-2 rounded hover:bg-gray-100">Logout</button>
          </div>
        </div>
      )}
    </div>
  )
}
