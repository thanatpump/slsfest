"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 shadow-2xl rounded-2xl px-10 py-8 w-full max-w-md flex flex-col gap-6 border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 text-center drop-shadow mb-2">Admin Login</h2>
        <p className="text-center text-blue-400 mb-2">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูล</p>
        <input
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg shadow"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg shadow"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition"
          type="submit"
        >
          เข้าสู่ระบบ
        </button>
        {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
      </form>
    </div>
  )
} 