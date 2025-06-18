import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request, context: unknown) {
  const { params } = context as { params: { id: string } };
  try {
    const seat = await prisma.seat.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!seat) {
      return NextResponse.json(
        { error: 'ไม่พบที่นั่งที่ต้องการ' },
        { status: 404 }
      );
    }

    return NextResponse.json(seat);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Database error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: unknown) {
  const { params } = context as { params: { id: string } };
  try {
    const body = await request.json();
    const seat = await prisma.seat.update({
      where: {
        id: params.id,
      },
      data: body,
    });

    return NextResponse.json(seat);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Database error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตที่นั่ง' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: unknown) {
  const { params } = context as { params: { id: string } };
  try {
    await prisma.seat.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'ลบที่นั่งเรียบร้อยแล้ว' });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Database error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบที่นั่ง' },
      { status: 500 }
    );
  }
} 