import React from 'react'

function Price({ price }){
  return <div className="text-2xl font-bold">${price.toFixed(2)}<span className="text-sm font-normal">/mo</span></div>
}

export default function PlanCard({ plan, isCurrent, onAction }){
  return (
    <div className="card border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">{plan.name}</div>
            <div className="text-sm opacity-90">{plan.duration} days</div>
          </div>
          <div className="text-right">
            <Price price={plan.price} />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white">
        <ul className="text-sm text-gray-700 space-y-2 mb-4">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-indigo-500 mt-1">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between">
          <div>
            {isCurrent ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Current</span> : null}
          </div>
          <div>
            <button onClick={() => onAction(plan)} className={`px-4 py-2 rounded-lg text-sm ${isCurrent ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`} disabled={isCurrent}>
              {isCurrent ? 'Current plan' : 'Choose plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
