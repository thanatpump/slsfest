import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_auth')
  if (!isAuth) {
    redirect('/admin/login')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-orange-600 mb-10">Admin Card Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <Link href="/admin/dashboard" className="block bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-300 hover:border-orange-500 hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-orange-100 text-orange-600 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-orange-700 group-hover:text-orange-900">Dashboard</span>
          </div>
          <p className="text-gray-600">ดูภาพรวมและสถิติของระบบ</p>
        </Link>

        <Link href="/admin/bookings" className="block bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-300 hover:border-orange-500 hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-orange-100 text-orange-600 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 0V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h7" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-orange-700 group-hover:text-orange-900">ยืนยันการชำระเงิน</span>
          </div>
          <p className="text-gray-600">ตรวจสอบและอนุมัติการชำระเงินของผู้จอง</p>
        </Link>

        <Link href="/admin/seats" className="block bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-300 hover:border-orange-500 hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-orange-100 text-orange-600 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-orange-700 group-hover:text-orange-900">จัดการที่นั่ง</span>
          </div>
          <p className="text-gray-600">ดูและแก้ไขข้อมูลที่นั่งทั้งหมดในระบบ</p>
        </Link>

        <Link href="/admin/bookers" className="block bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-300 hover:border-orange-500 hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-orange-100 text-orange-600 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <span className="text-2xl font-bold text-orange-700 group-hover:text-orange-900">จัดการข้อมูลผู้จอง</span>
          </div>
          <p className="text-gray-600">ดูและแก้ไขข้อมูลผู้จองทั้งหมดในระบบ</p>
        </Link>
      </div>
    </main>
  )
} 