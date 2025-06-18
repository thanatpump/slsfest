import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { supabase } from '@/lib/supabase';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const slip = formData.get('slip') as File | null;

    if (!email || !slip) {
      return NextResponse.json({ error: 'กรุณาระบุอีเมลและไฟล์สลิป' }, { status: 400 });
    }

    // ตรวจสอบว่ามีการจองที่รอสลิปหรือไม่
    const bookings = await prisma.booking.findMany({
      where: { 
        email,
        status: 'waiting_payment'
      }
    });

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ error: 'ไม่พบการจองที่รอสลิป' }, { status: 404 });
    }

    // อัปโหลดไฟล์สลิปเข้า Supabase Storage
    const fileName = `${Date.now()}_${slip.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage
      .from('slsfest-slip')
      .upload(`slips/${fileName}`, slip, {
        cacheControl: '3600',
        upsert: false
      });
    if (error) {
      return NextResponse.json({ error: 'อัปโหลดสลิปไม่สำเร็จ', detail: error.message }, { status: 500 });
    }
    const slipPath = data.path;

    // อัปเดตสถานะและสลิปในฐานข้อมูล
    await prisma.$transaction(
      bookings.map(booking =>
        prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentSlip: slipPath,
            status: 'pending'
          }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/upload-slip error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด', detail: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 