import React from 'react'

export default function SubscriptionList({ subscription, onManage }){
  if(!subscription) return null
  const { plan, status, startDate, endDate } = subscription
  return (
    <div className="card p-4 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{plan.name}</h3>
          <p className="muted text-sm mt-1">{plan.description || 'Your current plan'}</p>
          <ul className="mt-3 text-sm list-disc list-inside">
            {plan.features.map((f,i)=>(<li key={i} className="muted">{f}</li>))}
          </ul>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className={status==='active' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{status}</div>
          <div className="muted text-sm mt-2">Start: {new Date(startDate).toLocaleDateString()}</div>
          <div className="muted text-sm">End: {new Date(endDate).toLocaleDateString()}</div>
          <div className="mt-3">
            <button onClick={onManage} className="btn-primary px-3 py-1 rounded">Manage</button>
          </div>
        </div>
      </div>
    </div>
  )
}
