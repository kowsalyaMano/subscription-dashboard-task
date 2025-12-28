import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../api/axios'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState(null)
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(()=>{
    const params = new URLSearchParams(location.search)
    const e = params.get('email')
    if(e) setEmail(e)
  },[location.search])

  async function submit(e){
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try{
      const res = await axios.post('http://localhost:4000/api/auth/login',{ email, password })
      dispatch(setCredentials({ user: res.data.user, access: res.data.access, refresh: res.data.refresh }))
      navigate('/dashboard')
    }catch(error){
      const msg = error.response?.data?.error
     
      try{
        const existsRes = await api.get(`/api/auth/exists?email=${encodeURIComponent(email)}`)
        if(!existsRes.data.exists){
         
          navigate(`/register?email=${encodeURIComponent(email)}`)
          return
        }
      }catch(_){ }
      setErr(msg || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Welcome back</h3>
          <p className="opacity-90">Sign in to manage your subscription, view plans, and upgrade anytime.</p>
          <div className="mt-6">
            <svg className="w-48 h-48 opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" opacity="0.06"/>
              <path d="M7 10c1.38 0 2.5-1.12 2.5-2.5S8.38 5 7 5 4.5 6.12 4.5 7.5 5.62 10 7 10z" fill="white"/>
            </svg>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {err && <div className="text-red-600 mb-3">{String(err)}</div>}
          <form onSubmit={submit} className="space-y-4">
            <input className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white p-3 rounded-lg">{loading? 'Signing in…' : 'Login'}</button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            Don't have an account? <Link to={`/register?email=${encodeURIComponent(email)}`} className="text-indigo-600">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
