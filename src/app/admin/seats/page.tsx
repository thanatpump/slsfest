"use client";
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
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

const ARTISTS = [
  { id: 'น้ำแข็ง ทิพวรรณ', name: 'น้ำแข็ง ทิพวรรณ' },
  { id: 'เวียง นฤมล', name: 'เวียง นฤมล' },
  { id: 'วงไม้เลื้อย', name: 'วงไม้เลื้อย' }
];

export default function AdminSeatsPage() {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [booking, setBooking] = useState<AdminBooking>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedArtist, setSelectedArtist] = useState<string>('น้ำแข็ง ทิพวรรณ');

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/seats?artist=${encodeURIComponent(selectedArtist)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSeats([]);
      } else {
        setSeats(data.seats || []);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลที่นั่ง");
      setSeats([]);
    } finally {
      setLoading(false);
    }
  }, [selectedArtist]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  const handleSeatClick = async (seat: Seat) => {
    setSelectedSeat(seat);
    setBooking(null);
    setError('');
    try {
      const res = await fetch(`/api/admin/seat-booking?seatId=${seat.id}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setBooking(data.booking || null);
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
      setBooking(null);
    }
  };

  const handleResetSeat = async (seatId: string) => {
    if (!confirm('คุณต้องการรีเซ็ตที่นั่งนี้หรือไม่?')) return;
    
    setError('');
    try {
      const res = await fetch('/api/admin/seat-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId })
      });
      
      if (res.ok) {
        alert('รีเซ็ตที่นั่งสำเร็จ');
        fetchSeats();
        setSelectedSeat(null);
        setBooking(null);
      } else {
        const data = await res.json();
        setError(data.error || 'เกิดข้อผิดพลาดในการรีเซ็ตที่นั่ง');
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการรีเซ็ตที่นั่ง');
    }
  };

  // สร้าง layout object ให้ครบ props
  const layout = {
    zones: Array.from(new Set(seats.map(s => s.zone))),
    rows: seats.length > 0 ? Math.max(...seats.map(s => s.rowLabel.charCodeAt(0))) - Math.min(...seats.map(s => s.rowLabel.charCodeAt(0))) + 1 : 0,
    seatsPerRow: seats.length > 0 ? Math.max(...seats.map(s => s.number)) : 0,
    seats,
  };

  // ฟังก์ชันสำหรับแสดงราคา
  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') return '0';
    return price.toLocaleString();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec] p-8">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-6xl w-full text-center border-2 border-[#e75480]">
        <h1 className="text-3xl font-bold text-[#e75480] mb-6">จัดการที่นั่ง - Admin</h1>
        <Link href="/admin" className="inline-block mb-6 text-[#e75480] hover:text-pink-600 font-semibold">← กลับเมนูหลัก</Link>
        
        {/* เลือกศิลปิน */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-[#e75480] mb-2">เลือกศิลปิน:</label>
          <select 
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            className="px-4 py-2 border-2 border-[#e75480] rounded-lg focus:ring-[#e75480] focus:border-[#e75480]"
          >
            {ARTISTS.map(artist => (
              <option key={artist.id} value={artist.id}>{artist.name}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-lg">กำลังโหลดข้อมูล...</div>
        ) : seats.length === 0 ? (
          <div className="text-gray-500 text-lg">ไม่มีข้อมูลที่นั่งสำหรับศิลปินนี้</div>
        ) : (
          <div className="space-y-6">
            <SeatMap 
              layout={layout} 
              onSeatSelect={handleSeatClick} 
              adminMode={true}
              artist={selectedArtist}
            />
          </div>
        )}
      </div>

      {/* Modal แสดงรายละเอียดที่นั่ง */}
      {selectedSeat && (
        <div
          className="fixed top-0 right-0 h-full max-w-xs w-full bg-white rounded-l-xl shadow-2xl z-50 p-6 flex flex-col"
          style={{ borderLeft: '4px solid #e75480' }}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={() => setSelectedSeat(null)}
            aria-label="ปิด"
          >×</button>
          <h2 className="text-2xl font-bold text-[#e75480] mb-6">รายละเอียดที่นั่ง</h2>
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
            <h3 className="font-bold text-[#e75480] mb-2">รายละเอียดผู้จอง</h3>
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

          {/* ปุ่มรีเซ็ตที่นั่ง */}
          <div className="mt-6">
            <button
              onClick={() => handleResetSeat(selectedSeat.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              รีเซ็ตที่นั่ง
            </button>
          </div>
        </div>
      )}
    </main>
  )
} 