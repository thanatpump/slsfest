import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme123'

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_auth', '1', {
      httpOnly: true,
      path: '/admin',
      maxAge: 60 * 60, // 1 ชั่วโมง
      sameSite: 'lax',
      secure: true,
    })
    return res
  }
  return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
} 