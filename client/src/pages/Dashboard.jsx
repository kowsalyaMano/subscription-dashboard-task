import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import SummaryCard from '../components/SummaryCard'
import SubscriptionList from '../components/SubscriptionList'

export default function Dashboard(){
  const [sub,setSub]=useState(null)
  const [loading,setLoading]=useState(true)
  const navigate = useNavigate()

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    try{
      const res = await api.get('/api/my-subscription')
      setSub(res.data.subscription)
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="muted mt-1">Manage your subscription, billing and account settings</p>
          </div>
          <div className="flex gap-3">
            <Link to="/plans" className="btn-primary px-4 py-2 rounded">Browse Plans</Link>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="Current Plan" value={sub ? sub.plan.name : 'None'}>💳</SummaryCard>
          <SummaryCard title="Status" value={sub ? sub.status : 'Inactive'}>{sub && sub.status==='active' ? '✅' : '⚠️'}</SummaryCard>
          <SummaryCard title="Next Renewal" value={sub ? new Date(sub.endDate).toLocaleDateString() : '-'}>📅</SummaryCard>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Subscription</h2>
          {loading && <div className="muted">Loading...</div>}
          {!loading && !sub && (
            <div className="card p-6 rounded-lg">
              <h3 className="font-bold text-lg">No active subscription</h3>
              <p className="muted mt-2">You don't have an active plan. Browse plans to get started.</p>
              <div className="mt-4">
                <Link to="/plans" className="btn-primary px-4 py-2 rounded">Choose a Plan</Link>
              </div>
            </div>
          )}

          {!loading && sub && (
            <SubscriptionList subscription={sub} onManage={()=>navigate('/plans')} />
          )}
        </div>
      </div>
    </div>
  )
}
