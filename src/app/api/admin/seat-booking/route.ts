import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seatId = searchParams.get('seatId');
  if (!seatId) {
    return NextResponse.json({ error: 'กรุณาระบุ seatId' }, { status: 400 });
  }
  const booking = await prisma.booking.findFirst({
    where: { seatId },
    orderBy: { createdAt: 'desc' },
    include: {
      seat: {
        select: {
          price: true
        }
      }
    }
  });

  if (booking) {
    return NextResponse.json({ 
      booking: {
        ...booking,
        price: booking.seat.price
      }
    });
  }

  return NextResponse.json({ booking: null });
}

export async function PATCH(req: NextRequest) {
  const { seatId, status } = await req.json();
  if (!seatId || !status) {
    return NextResponse.json({ error: 'กรุณาระบุ seatId และ status' }, { status: 400 });
  }
  await prisma.seat.update({ where: { id: seatId }, data: { status } });
  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  // reset seat: ลบ booking ทั้งหมดของ seatId และเปลี่ยน seat เป็น available
  const { seatId } = await req.json();
  if (!seatId) {
    return NextResponse.json({ error: 'กรุณาระบุ seatId' }, { status: 400 });
  }
  await prisma.booking.deleteMany({ where: { seatId } });
  await prisma.seat.update({ where: { id: seatId }, data: { status: 'available' } });
  return NextResponse.json({ success: true });
} 