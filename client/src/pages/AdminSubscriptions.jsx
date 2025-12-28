import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminSubscriptions(){
  const [subs,setSubs]=useState([])
  useEffect(()=>{ load() }, [])
  async function load(){
    const token = localStorage.getItem('access')
    try{
      const res = await axios.get('http://localhost:4000/api/admin/subscriptions', { headers: { Authorization: `Bearer ${token}` } })
      setSubs(res.data)
    }catch(e){ console.error(e) }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Subscriptions</h2>
      <div className="space-y-3">
        {subs.map(s=> (
          <div key={s.id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{s.user.name} ({s.user.email})</div>
                <div className="text-sm text-gray-600">Plan: {s.plan.name}</div>
              </div>
              <div className="text-sm text-gray-600">{new Date(s.startDate).toLocaleDateString()} → {new Date(s.endDate).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
