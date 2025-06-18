"use client";
import Link from 'next/link'
import { useState, useEffect } from 'react'
import SeatMap from '@/components/SeatMap'
import { Seat } from '@/types/seat';

type AdminBooking = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  price: number;
} | null;

export default function AdminSeatsPage() {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [booking, setBooking] = useState<AdminBooking>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/seats')
      .then(res => res.json())
      .then(data => setSeats(data.seats || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSeatClick = async (seat: Seat) => {
    setSelectedSeat(seat);
    setBooking(null);
    try {
      const res = await fetch(`/api/admin/seat-booking?seatId=${seat.id}`);
      const data = await res.json();
      setBooking(data.booking || null);
    } catch {
      setBooking(null);
    }
  };

  // สร้าง layout object ให้ครบ props
  const layout = {
    zones: Array.from(new Set(seats.map(s => s.zone))),
    rows: Math.max(...seats.map(s => s.rowLabel.charCodeAt(0))) - Math.min(...seats.map(s => s.rowLabel.charCodeAt(0))) + 1,
    seatsPerRow: Math.max(...seats.map(s => s.number)),
    seats,
  };

  // ฟังก์ชันสำหรับแสดงราคา
  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') return '0';
    return price.toLocaleString();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-5xl w-full text-center border border-orange-200">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">ข้อมูลที่นั่ง</h1>
        <Link href="/admin" className="inline-block mb-6 text-orange-500 hover:text-orange-700 font-semibold">← กลับเมนูหลัก</Link>
        {loading ? (
          <div className="text-gray-400">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="space-y-6">
            <SeatMap layout={layout} onSeatSelect={handleSeatClick} adminMode />
          </div>
        )}
      </div>

      {/* Modal แสดงรายละเอียดที่นั่ง */}
      {selectedSeat && (
        <div
          className="fixed top-0 right-0 h-full max-w-xs w-full bg-white rounded-l-xl shadow-2xl z-50 p-6 flex flex-col"
          style={{ borderLeft: '4px solid #fb923c' }}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={() => setSelectedSeat(null)}
            aria-label="ปิด"
          >×</button>
          <h2 className="text-2xl font-bold text-orange-600 mb-6">รายละเอียดที่นั่ง {selectedSeat.id}</h2>
          <div className="space-y-4 text-left">
            <p><span className="font-semibold">รหัสที่นั่ง:</span> {selectedSeat.id}</p>
            <p><span className="font-semibold">โซน:</span> {selectedSeat.zone}</p>
            <p><span className="font-semibold">แถว:</span> {selectedSeat.rowLabel}</p>
            <p><span className="font-semibold">หมายเลข:</span> {selectedSeat.number}</p>
            <p><span className="font-semibold">ราคา:</span> {formatPrice(selectedSeat.price)} บาท</p>
            <p><span className="font-semibold">สถานะ:</span> {
              selectedSeat.status === 'available' ? 'ว่าง' :
              selectedSeat.status === 'reserved' ? 'จองแล้ว' :
              selectedSeat.status === 'occupied' ? 'มีผู้ใช้แล้ว' :
              'ไม่ว่าง'
            }</p>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-orange-500 mb-2">รายละเอียดผู้จอง</h3>
            {booking ? (
              <div className="space-y-2">
                <p><span className="font-semibold">ชื่อ-นามสกุล:</span> {booking.firstName} {booking.lastName}</p>
                <p><span className="font-semibold">อีเมล:</span> {booking.email}</p>
                <p><span className="font-semibold">เบอร์โทร:</span> {booking.phone}</p>
                <p><span className="font-semibold">สถานะ:</span> {
                  booking.status === 'pending' ? 'รอการชำระเงิน' :
                  booking.status === 'approved' ? 'อนุมัติแล้ว' :
                  'ปฏิเสธ'
                }</p>
                <p><span className="font-semibold">ราคาที่จอง:</span> {formatPrice(booking.price)} บาท</p>
              </div>
            ) : (
              <p className="text-gray-400">ยังไม่มีผู้จอง</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
} 