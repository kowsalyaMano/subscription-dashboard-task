import React from 'react'

export default function ConfirmModal({ open, title, description, onCancel, onConfirm }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-indigo-600 text-white">Confirm</button>
        </div>
      </div>
    </div>
  )
}
