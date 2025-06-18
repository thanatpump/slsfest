import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface Seat {
  id: string;
  zone: string;
  number: number;
  status: string;
  price: number;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const phone = formData.get('phone') as string;
      const seats = JSON.parse(formData.get('seats') as string) as Seat[];
      const email = formData.get('email') as string;
      const slip = formData.get('slip') as File | null;
      const artist = formData.get('artist') as string;
      let slipPath = null;
      if (slip) {
        const buffer = Buffer.from(await slip.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
          await mkdir(uploadDir, { recursive: true });
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;
        }
        const fileName = `${Date.now()}_${slip.name.replace(/\s/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        slipPath = `/uploads/${fileName}`;
      }
      // ตรวจสอบว่าที่นั่งยังว่างอยู่ + อัปเดตสถานะใน transaction
      const seatIds = seats.map(s => s.id);
      const bookings = await prisma.$transaction(async (tx) => {
        // 1. อัปเดตสถานะที่นั่งเป็น reserved เฉพาะที่ยัง available
        const updateResult = await tx.seat.updateMany({
          where: { id: { in: seatIds }, status: 'available' },
          data: { status: 'reserved' },
        });
        if (updateResult.count !== seatIds.length) {
          throw new Error('มีที่นั่งบางที่ถูกจองไปแล้ว');
        }
        // 2. สร้าง booking
        return Promise.all(
          seats.map(seat =>
            tx.booking.create({
              data: {
                seatId: seat.id,
                firstName,
                lastName,
                phone,
                email,
                paymentSlip: slipPath,
                status: 'waiting_payment',
                artist,
              },
            })
          )
        );
      });
      return NextResponse.json({ success: true, bookings });
    } else {
      return NextResponse.json({ error: 'Content-Type ต้องเป็น multipart/form-data' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('API /api/booking error:', error);
    const errMsg =
      typeof error === 'object' && error && 'message' in error
        ? (error as { message?: string }).message
        : '';
    if (typeof errMsg === 'string' && errMsg.includes('ถูกจองไปแล้ว')) {
      return NextResponse.json({ error: errMsg }, { status: 409 });
    }
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด', detail: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 