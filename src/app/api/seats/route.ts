import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const artist = searchParams.get('artist');
    if (!artist) {
      return NextResponse.json({ error: 'กรุณาระบุ artist' }, { status: 400 });
    }
    const seats = await prisma.seat.findMany({
      where: { artist },
      orderBy: [
        { rowLabel: 'asc' },
        { number: 'asc' }
      ]
    });
    return NextResponse.json({ seats });
  } catch (e) {
    console.error('API /api/seats error:', e);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด', detail: String(e) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 