import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const slip = formData.get('slip') as File | null;
    const bookingIds = (formData.get('bookingIds') as string || '').split(',').map(id => Number(id)).filter(Boolean);

    if (!slip || bookingIds.length === 0) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const buffer = Buffer.from(await slip.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}_${slip.name.replace(/\s/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const slipPath = `/uploads/${fileName}`;

    // อัปเดต booking ทุกตัว
    await prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: { paymentSlip: slipPath, status: 'pending' }
    });

    return NextResponse.json({ success: true, slip: slipPath });
  } catch (error) {
    console.error('API /api/payment/upload-slip error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปโหลดสลิป' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingIdsParam = searchParams.get('bookingIds');
  if (!bookingIdsParam) {
    return NextResponse.json({ error: 'กรุณาระบุ bookingIds' }, { status: 400 });
  }
  const bookingIds = bookingIdsParam.split(',').map(id => Number(id)).filter(Boolean);
  if (!bookingIds.length) {
    return NextResponse.json({ error: 'bookingIds ไม่ถูกต้อง' }, { status: 400 });
  }
  const bookings = await prisma.booking.findMany({
    where: { id: { in: bookingIds } },
    include: { seat: true },
  });
  if (!bookings.length) {
    return NextResponse.json({ error: 'ไม่พบ booking' }, { status: 404 });
  }
  const amount = bookings.reduce((sum, b) => sum + (b.seat?.price || 0), 0);
  const response = NextResponse.json({ amount, bookings });
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return response;
} 