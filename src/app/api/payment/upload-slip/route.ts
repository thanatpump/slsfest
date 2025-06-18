import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabase';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('slip') as File;
    const bookingIds = (formData.get('bookingIds') as string || '').split(',').map(id => Number(id)).filter(Boolean);

    if (!file || bookingIds.length === 0) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage
      .from('slsfest-slip')
      .upload(`slips/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const slipPath = data.path;

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