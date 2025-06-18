import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminTable from '../AdminTable'

export default async function AdminBookingsPage() {
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_auth')
  if (!isAuth) {
    redirect('/admin/login')
  }
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <AdminTable />
    </main>
  )
} 