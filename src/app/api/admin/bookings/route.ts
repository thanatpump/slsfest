import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    return NextResponse.json({ bookings });
  } catch (e) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด', detail: String(e) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 