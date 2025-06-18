import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const seats = await prisma.seat.findMany({
      orderBy: [{ rowLabel: 'asc' }, { number: 'asc' }],
    });
    return NextResponse.json({ seats });
  } catch (e) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด', detail: String(e) }, { status: 500 });
  }
} 