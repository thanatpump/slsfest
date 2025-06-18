import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();
    const bookingId = Number(id);
    
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action ไม่ถูกต้อง' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: 'ไม่พบ booking' }, { status: 404 });
    }

    // อัปเดตสถานะ booking
    const status = action === 'approve' ? 'approved' : 'rejected';
    await prisma.booking.update({ where: { id: bookingId }, data: { status } });

    // อัปเดตสถานะที่นั่ง
    await prisma.seat.update({
      where: { id: booking.seatId },
      data: { status: action === 'approve' ? 'occupied' : 'available' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling booking:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
} 