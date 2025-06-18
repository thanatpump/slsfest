import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let id, firstName, lastName, email, phone, status, paymentSlipPath = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = formData.get('id');
      firstName = formData.get('firstName');
      lastName = formData.get('lastName');
      email = formData.get('email');
      phone = formData.get('phone');
      status = formData.get('status');
      const paymentSlip = formData.get('paymentSlip');
      if (paymentSlip && typeof paymentSlip === 'object' && 'arrayBuffer' in paymentSlip) {
        const buffer = Buffer.from(await paymentSlip.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        const fileName = `${Date.now()}_${paymentSlip.name.replace(/\s/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        paymentSlipPath = `/uploads/${fileName}`;
      }
    } else {
      const body = await request.json();
      id = body.id;
      firstName = body.firstName;
      lastName = body.lastName;
      email = body.email;
      phone = body.phone;
      status = body.status;
    }

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      firstName,
      lastName,
      email,
      phone,
      status,
    };
    if (paymentSlipPath) {
      updateData.paymentSlip = paymentSlipPath;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
} 