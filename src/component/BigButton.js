import React from 'react'

export default function BigButton({type = 'button', className = '', label = 'Button'}) {
  return (
    <button type={type} className={`${className} px-28 py-5 border border-gray-800 text-gray-800 hover:bg-blue-900 hover:text-white transition-all duration-300 cursor-pointer`}>{label}</button>
  )
}
