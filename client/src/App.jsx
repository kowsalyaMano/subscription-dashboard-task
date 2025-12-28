import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectAccessToken } from './store/authSlice'
import Login from './pages/Login'
import Register from './pages/Register'
import Plans from './pages/Plans'
import Dashboard from './pages/Dashboard'
import AdminSubscriptions from './pages/AdminSubscriptions'
import UserMenu from './components/UserMenu'
import axios from 'axios'
import ThemeToggle from './components/ThemeToggle'

function Protected({ children, role }) {
  const token = useSelector(selectAccessToken)
  const user = useSelector(selectCurrentUser)
  if (!token) return <Navigate to="/login" />
  if (role && user?.role !== role) return <Navigate to="/" />
  return children
}

export default function App() {
  const authUser = useSelector(selectCurrentUser)
  const access = useSelector(selectAccessToken)
  const [subscription, setSubscription] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    async function loadSub(){
      if(!access) return setSubscription(null)
      try{
        const res = await axios.get('http://localhost:4000/api/my-subscription', { headers: { Authorization: `Bearer ${access}` } })
        setSubscription(res.data.subscription)
      }catch(e){ setSubscription(null) }
    }
    loadSub()
  }, [authUser, access])

  return (
    <div className="min-h-screen transition-theme">
      <header className="bg-surface border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded flex items-center justify-center font-bold">SD</div>
              <div className="hidden sm:block">
                <div className="font-bold">Subscription Dashboard</div>
                <div className="text-xs text-gray-500">Manage plans & subscriptions</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-3 ml-6">
              <Link to="/plans" className="text-sm text-gray-700 hover:text-indigo-600">Plans</Link>
              {authUser && <Link to="/dashboard" className="text-sm text-gray-700 hover:text-indigo-600">My Dashboard</Link>}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
            {!authUser ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-700">Login</Link>
                <Link to="/register" className="text-sm text-indigo-600">Register</Link>
              </div>
            ) : (
              <UserMenu user={authUser} subscription={subscription} onLogout={() => { setSubscription(null); navigate('/login') }} />
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/plans" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/admin/subscriptions" element={<Protected role="admin"><AdminSubscriptions /></Protected>} />
        </Routes>
      </main>
    </div>
  )
}
