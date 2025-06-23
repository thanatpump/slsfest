import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetData() {
  try {
    console.log('เริ่มต้นรีเซ็ตข้อมูล...');

    // ลบข้อมูลการจองทั้งหมด
    console.log('ลบข้อมูลการจอง...');
    await prisma.booking.deleteMany({});
    console.log('ลบข้อมูลการจองเสร็จสิ้น');

    // รีเซ็ตสถานะที่นั่งทั้งหมดเป็น available
    console.log('รีเซ็ตสถานะที่นั่ง...');
    await prisma.seat.updateMany({
      data: {
        status: 'available'
      }
    });
    console.log('รีเซ็ตสถานะที่นั่งเสร็จสิ้น');

    console.log('✅ รีเซ็ตข้อมูลเสร็จสิ้นแล้ว!');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการรีเซ็ตข้อมูล:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetData(); 