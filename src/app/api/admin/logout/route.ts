import { NextResponse } from 'next/server'
 
export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_auth', '', { httpOnly: true, path: '/admin', maxAge: 0 })
  return res
} 