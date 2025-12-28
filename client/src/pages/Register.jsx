import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../api/axios'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function Register(){
  const [name,setName]=useState('')
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
      const res = await axios.post('http://localhost:4000/api/auth/register',{ name, email, password })
      dispatch(setCredentials({ user: res.data.user, access: res.data.access, refresh: res.data.refresh }))
      navigate('/dashboard')
    }catch(error){
      const status = error.response?.status
      const msg = error.response?.data?.error || 'Register failed'
      if(status === 409) {
        setErr('Account already registered. Redirecting to login…')
        setTimeout(()=> navigate(`/login?email=${encodeURIComponent(email)}`), 1300)
      } else {
        setErr(msg)
      }
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Create your account</h2>
          {err && <div className="text-red-600 mb-3">{String(err)}</div>}
          <form onSubmit={submit} className="space-y-4">
            <input className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Password (min 6 chars)" value={password} onChange={e=>setPassword(e.target.value)} />
            <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white p-3 rounded-lg">{loading? 'Creating…' : 'Register'}</button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            Already have an account? <Link to={`/login?email=${encodeURIComponent(email)}`} className="text-indigo-600">Login</Link>
          </div>
        </div>
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-500 to-teal-600 p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Get started</h3>
          <p className="opacity-90">Join now and manage subscriptions, upgrade plans, and enjoy a streamlined admin experience.</p>
        </div>
      </div>
    </div>
  )
}
