import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ตรวจสอบการจองที่หมดเวลา (เกิน 24 ชั่วโมงและยังไม่ได้ชำระเงิน)
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'waiting_payment',
        expiresAt: {
          lt: new Date() // น้อยกว่าปัจจุบัน = หมดเวลาแล้ว
        }
      },
      include: {
        seat: true
      }
    });

    if (expiredBookings.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: 'ไม่มีการจองที่หมดเวลา', 
        expiredCount: 0,
        timestamp: new Date().toISOString()
      });
    }

    // รีเซ็ตการจองที่หมดเวลา
    const result = await prisma.$transaction(async (tx) => {
      // 1. อัปเดตสถานะที่นั่งกลับเป็น available
      const seatIds = expiredBookings.map(booking => booking.seatId);
      await tx.seat.updateMany({
        where: {
          id: { in: seatIds }
        },
        data: {
          status: 'available'
        }
      });

      // 2. อัปเดตสถานะการจองเป็น expired
      await tx.booking.updateMany({
        where: {
          id: { in: expiredBookings.map(b => b.id) }
        },
        data: {
          status: 'expired'
        }
      });

      return {
        expiredCount: expiredBookings.length,
        seatIds: seatIds,
        bookingIds: expiredBookings.map(b => b.id)
      };
    });

    console.log(`[AUTO RESET] รีเซ็ตการจองที่หมดเวลา ${result.expiredCount} รายการ - ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: `รีเซ็ตการจองที่หมดเวลา ${result.expiredCount} รายการ`,
      expiredCount: result.expiredCount,
      seatIds: result.seatIds,
      bookingIds: result.bookingIds,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[AUTO RESET ERROR]', error);
    return NextResponse.json({ 
      success: false,
      error: 'เกิดข้อผิดพลาดในการรีเซ็ตการจองที่หมดเวลา',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 