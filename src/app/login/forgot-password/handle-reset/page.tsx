import React from 'react'



const HandleReset = () => {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form className="space-y-4">
          <input type="text"
          placeholder='enter Token'
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      
    </div>
  </div>
  )
}

export default HandleReset