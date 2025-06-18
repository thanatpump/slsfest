import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  // ดึงข้อมูลผู้จองทั้งหมด (group by email)
  const bookers = await prisma.booking.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });
  return NextResponse.json({ bookers });
} 