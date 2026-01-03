"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Hardcoded user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1712 345 678",
    joinDate: "January 15, 2023"
  };

  // Hardcoded dashboard stats
  const dashboardStats = {
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 10,
    totalSpent: 245000
  };

  // Hardcoded orders data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 45000,
      items: [
        { name: "Casio G-Shock GA-2100", quantity: 1, price: 45000 }
      ]
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      status: "Processing",
      total: 125000,
      items: [
        { name: "Seiko Presage Cocktail Time", quantity: 1, price: 125000 }
      ]
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-05",
      status: "Delivered",
      total: 75000,
      items: [
        { name: "Tissot PRX Powermatic 80", quantity: 1, price: 75000 }
      ]
    },
    {
      id: "ORD-2023-012",
      date: "2023-12-20",
      status: "Delivered",
      total: 35000,
      items: [
        { name: "Watch Strap - Leather Brown", quantity: 2, price: 17500 }
      ]
    }
  ];

  // Hardcoded addresses
  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      phone: "+880 1712 345 678",
      address: "House 123, Road 45",
      area: "Gulshan-2",
      city: "Dhaka",
      postalCode: "1212",
      isDefault: true
    },
    {
      id: 2,
      type: "Office",
      name: "John Doe",
      phone: "+880 1712 345 678",
      address: "Suite 5B, Level 10",
      area: "Banani",
      city: "Dhaka",
      postalCode: "1213",
      isDefault: false
    }
  ];

  const handleLogout = () => {
    // Placeholder for logout functionality
    if (confirm("Are you sure you want to logout?")) {
      // In real app, this would clear auth state and redirect
      window.location.href = "/login";
    }
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      )
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      id: 'address', 
      label: 'Address', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'account', 
      label: 'Account Details', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-gray-900 text-white">
            <div className="sticky top-0">
              {/* User Info */}
              <div className="p-8 border-b border-gray-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-xl font-light tracking-wider border border-gray-700">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base text-white truncate">{userData.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{userData.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="p-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 mb-1 transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gray-800 text-white border-l-2 border-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-800 mt-auto">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-gray-100 min-h-screen">
            <div className="p-8 lg:p-12">
              {/* Dashboard View */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Page Header */}
                  <div>
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Dashboard</h1>
                    <p className="text-gray-500 text-sm">Overview of your account activity</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Total Orders</p>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-light text-gray-900">{dashboardStats.totalOrders}</p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Pending Orders</p>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-light text-amber-600">{dashboardStats.pendingOrders}</p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Completed Orders</p>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-light text-gray-900">{dashboardStats.completedOrders}</p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Total Spent</p>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-light text-gray-900">৳{dashboardStats.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="bg-white border border-gray-200">
                    <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                      >
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 mb-1">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 mb-2">৳{order.total.toLocaleString()}</p>
                              <span className={`inline-block px-3 py-1 text-xs font-medium ${
                                order.status === 'Delivered' ? 'bg-gray-100 text-gray-700' :
                                order.status === 'Processing' ? 'bg-amber-50 text-amber-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {/* Orders View */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Orders</h1>
                  <p className="text-gray-500 text-sm">View and manage your order history</p>
                </div>
                <div className="bg-white border border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">Placed on {order.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium text-gray-900">৳{order.total.toLocaleString()}</p>
                            </div>
                            <span className={`inline-block px-3 py-1.5 text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-gray-100 text-gray-700' :
                              order.status === 'Processing' ? 'bg-amber-50 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-5 mb-5">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                                <span className="text-gray-900 font-medium">৳{item.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-5 border-t border-gray-200">
                          <button className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                            View Details
                          </button>
                          {order.status === 'Delivered' && (
                            <button className="px-5 py-2.5 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-sm font-medium transition-colors">
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Address View */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Addresses</h1>
                    <p className="text-gray-500 text-sm">Manage your delivery addresses</p>
                  </div>
                  <button className="px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium transition-colors">
                    Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`bg-white border p-6 relative ${
                        address.isDefault
                          ? 'border-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-xs font-medium">
                          DEFAULT
                        </span>
                      )}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {address.type === 'Home' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            )}
                          </svg>
                          <h3 className="font-medium text-gray-900 uppercase tracking-wider text-sm">{address.type}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{address.name}</p>
                          <p>{address.phone}</p>
                          <p className="mt-3 leading-relaxed">
                            {address.address}, {address.area}<br />
                            {address.city} - {address.postalCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-5 border-t border-gray-200">
                        <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                          Edit
                        </button>
                        {!address.isDefault && (
                          <>
                            <button className="flex-1 px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-sm font-medium transition-colors">
                              Set as Default
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Details View */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">Account Details</h1>
                  <p className="text-gray-500 text-sm">Manage your personal information and preferences</p>
                </div>

                <div className="bg-white border border-gray-200">
                  <div className="p-8">
                    <div className="max-w-2xl">
                      {/* Profile Picture Section */}
                      <div className="flex items-center gap-8 pb-8 border-b border-gray-200 mb-8">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-2xl font-light text-white tracking-wider border border-gray-700">
                          {userData.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <button className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors mb-2">
                            Change Photo
                          </button>
                          <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
                        </div>
                      </div>

                      {/* Account Information */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={userData.name}
                            className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={userData.email}
                            className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue={userData.phone}
                            className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors text-gray-900"
                          />
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wider">Change Password</h3>
                          <div className="space-y-5">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                Current Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                New Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-colors text-gray-900"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium transition-colors">
                              Save Changes
                            </button>
                            <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>

                        {/* Account Info */}
                        <div className="pt-8 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">Account Information</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium text-gray-900">Member since:</span> {userData.joinDate}</p>
                            <p><span className="font-medium text-gray-900">Account ID:</span> #{userData.email.split('@')[0].toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

