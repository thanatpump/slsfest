import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'กรุณาระบุอีเมล' }, { status: 400 });
  }

  // ดึงข้อมูล booking จริงจากฐานข้อมูล
  const bookings = await prisma.booking.findMany({
    where: { email },
    include: { seat: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลการจอง' }, { status: 404 });
  }

  // รวมข้อมูลที่ต้องแสดง
  const seats = bookings.map(b => b.seatId);
  const totalAmount = bookings.reduce((sum, b) => sum + (b.seat?.price || 0), 0);
  const first = bookings[0];
  const result = {
    status: first.status,
    name: `${first.firstName} ${first.lastName}`,
    email: first.email,
    phone: first.phone,
    seats,
    amount: totalAmount,
    note: '',
  };

  return NextResponse.json(result);
} 