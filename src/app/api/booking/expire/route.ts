import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
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
        message: 'ไม่มีการจองที่หมดเวลา', 
        expiredCount: 0 
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
        seatIds: seatIds
      };
    });

    return NextResponse.json({
      message: `รีเซ็ตการจองที่หมดเวลา ${result.expiredCount} รายการ`,
      expiredCount: result.expiredCount,
      seatIds: result.seatIds
    });

  } catch (error) {
    console.error('API /api/booking/expire error:', error);
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการรีเซ็ตการจองที่หมดเวลา' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint สำหรับดูการจองที่หมดเวลา (สำหรับ admin)
export async function GET() {
  try {
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'waiting_payment',
        expiresAt: {
          lt: new Date()
        }
      },
      include: {
        seat: true
      },
      orderBy: {
        expiresAt: 'asc'
      }
    });

    return NextResponse.json({
      expiredBookings: expiredBookings.map(booking => ({
        id: booking.id,
        seatId: booking.seatId,
        seatInfo: `${booking.seat.zone} ${booking.seat.rowLabel}${booking.seat.number}`,
        customerName: `${booking.firstName} ${booking.lastName}`,
        phone: booking.phone,
        email: booking.email,
        createdAt: booking.createdAt,
        expiresAt: booking.expiresAt,
        artist: booking.artist
      })),
      count: expiredBookings.length
    });

  } catch (error) {
    console.error('API /api/booking/expire GET error:', error);
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจองที่หมดเวลา' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 