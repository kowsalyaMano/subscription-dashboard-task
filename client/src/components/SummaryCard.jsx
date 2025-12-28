import React from 'react'

export default function SummaryCard({ title, value, children, className = '' }){
  return (
    <div className={`card p-4 rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm muted">{title}</div>
          <div className="font-semibold text-xl mt-1">{value}</div>
        </div>
        <div className="text-2xl opacity-80">{children}</div>
      </div>
    </div>
  )
}
