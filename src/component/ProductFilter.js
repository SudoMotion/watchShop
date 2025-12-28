"use client";
import React, { useState } from 'react'

export default function ProductFilter() {
  const [open, setOpen] = useState('gender');

  const toggle = (key) => {
    setOpen(prev => prev === key ? null : key);
  };

  return (
    <div className='border border-gray-200 p-5 rounded-xl shadow-md flex flex-col gap-y-4 max-h-screen overflow-y-auto'>
      <h2 className="text-lg font-semibold text-gray-800">Filters</h2>

      {/* Gender */}
      <div className='border border-gray-200 p-3 rounded-md'>
        <button
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === 'gender' ? 'border-b border-gray-300' : ''
          }`}
          onClick={() => toggle('gender')}
        >
          <span>Gender</span>
          <span className="text-gray-500">{open === 'gender' ? '-' : '+'}</span>
        </button>

        {open === 'gender' && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Mens Watch</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Ladies Watch</span>
            </label>
          </div>
        )}
      </div>

      {/* Available Product */}
      <div className='border border-gray-200 p-3 rounded-md'>
        <button
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === 'available' ? 'border-b border-gray-300' : ''
          }`}
          onClick={() => toggle('available')}
        >
          <span>Available Product</span>
          <span className="text-gray-500">{open === 'available' ? '-' : '+'}</span>
        </button>

        {open === 'available' && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>In Stock</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Out of Stock</span>
            </label>
          </div>
        )}
      </div>

      {/* Movement */}
      <div className='border border-gray-200 p-3 rounded-md'>
        <button
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === 'movement' ? 'border-b border-gray-300' : ''
          }`}
          onClick={() => toggle('movement')}
        >
          <span>Movement</span>
          <span className="text-gray-500">{open === 'movement' ? '-' : '+'}</span>
        </button>

        {open === 'movement' && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Automatic</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Quartz</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Solar</span>
            </label>
          </div>
        )}
      </div>

      {/* Band Type */}
      <div className='border border-gray-200 p-3 rounded-md'>
        <button
          className={`text-xl flex items-center justify-between w-full text-left ${
            open === 'band' ? 'border-b border-gray-300' : ''
          }`}
          onClick={() => toggle('band')}
        >
          <span>Band Type</span>
          <span className="text-gray-500">{open === 'band' ? '-' : '+'}</span>
        </button>

        {open === 'band' && (
          <div className="mt-2 ml-4 flex flex-col gap-y-2">
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Stainless Steel</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Leather</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Rubber</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Calfskin</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Nylon</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Silicone</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Canvas</span>
            </label>
            <label className='flex items-center gap-x-1'>
              <input type="checkbox" />
              <span>Calfskin + Silicone</span>
            </label>
          </div>
        )}
      </div>

    </div>
  )
}
