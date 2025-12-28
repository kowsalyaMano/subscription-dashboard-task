import React, { useEffect, useState } from 'react'
import axios from 'axios'
import api from '../api/axios'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/authSlice'
import PlanCard from '../components/PlanCard'
import ConfirmModal from '../components/ConfirmModal'

export default function Plans(){
  const [plans,setPlans]=useState([])
  const [err,setErr]=useState(null)
  const [currentSub, setCurrentSub] = useState(null)
  const user = useSelector(selectCurrentUser)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(()=>{ fetchPlans() }, [])
  useEffect(()=>{ if(user) fetchMySub() }, [user])

  async function fetchMySub(){
    try{
      const res = await api.get('/api/my-subscription')
      setCurrentSub(res.data.subscription)
    }catch(e){ setCurrentSub(null) }
  }

  async function fetchPlans(){
    try{
      const res = await axios.get('http://localhost:4000/api/plans')
      setPlans(res.data)
    }catch(e){ setErr('Could not load plans') }
  }

  async function subscribe(id){
    try{
      await api.post(`/api/subscribe/${id}`)
      await fetchMySub()
      window.location.href = '/dashboard'
    }catch(e){ alert(e.response?.data?.error || 'Subscribe failed') }
  }

  function handleChoose(plan){
    setSelectedPlan(plan)
    setConfirmOpen(true)
  }

  async function confirmChoose(){
    if(!selectedPlan) return
    await subscribe(selectedPlan.id)
    setConfirmOpen(false)
    setSelectedPlan(null)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Plans</h2>
      {err && <div className="text-red-500">{err}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p=> {
          const isCurrent = currentSub && currentSub.plan && currentSub.plan.id === p.id
          return (
            <PlanCard key={p.id} plan={p} isCurrent={isCurrent} onAction={handleChoose} />
          )
        })}
      </div>
      <ConfirmModal open={confirmOpen} title={selectedPlan ? `Confirm ${selectedPlan.name}` : ''} description={selectedPlan ? `Switch to the ${selectedPlan.name} plan for $${selectedPlan.price.toFixed(2)}/month?` : ''} onCancel={() => setConfirmOpen(false)} onConfirm={confirmChoose} />
    </div>
  )
}
