import React from 'react'

export default function Register() {
  return (
    <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* LOGIN FORM */}
      <div className="pr-5 border-r">
        <h2 className="text-teal-600 font-bold text-2xl border-b-2 border-teal-500 inline-block mb-8">
          LOGIN
        </h2>

        <div className="space-y-6">

          <div className="grid grid-cols-3 items-center">
            <label className="font-semibold text-gray-700">Mobile</label>
            <input
              type="text"
              placeholder="Phone Number"
              className="col-span-2 border px-4 py-2 w-full outline-none"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="col-span-2 border px-4 py-2 w-full outline-none"
            />
          </div>

          <div className="flex items-center space-x-4 mt-3">
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-2 rounded-sm">
              LOGIN
            </button>

            <button className="border px-5 py-2 rounded-sm">
              Forgot Password?
            </button>
          </div>

        </div>
      </div>

      {/* BILLING ADDRESS FORM */}
      <div className="pl-5">
        <h2 className="text-teal-600 font-bold text-2xl border-b-2 border-teal-500 inline-block mb-8">
          BILLING ADDRESS
        </h2>

        <div className="space-y-6">

          <div className="grid grid-cols-3 items-center">
            <label className="font-semibold text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="col-span-2 border px-4 py-2 w-full outline-none"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="font-semibold text-gray-700">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              className="col-span-2 border px-4 py-2 w-full outline-none"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="E-mail Address"
              className="col-span-2 border px-4 py-2 w-full outline-none"
            />
          </div>

          <div className="grid grid-cols-3 items-start">
            <label className="font-semibold text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Address..."
              rows={3}
              className="col-span-2 border px-4 py-2 w-full outline-none"
            />
          </div>

          <div className="grid grid-cols-3 items-center">
            <label className="font-semibold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="col-span-2 border px-4 py-2 w-full outline-none"
            />
          </div>

          <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold w-full py-3 rounded-sm mt-3">
            DONE
          </button>

        </div>
      </div>

    </div>
  )
}
