'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Image from 'next/image';
import SeatMap from '@/components/SeatMap';
import { Seat as SeatType } from '@/types/seat';
import { useRouter } from 'next/navigation';

// seatRows และ initialLayout ไม่จำเป็นต้องกำหนดเองแล้ว เพราะดึงจาก backend

interface BookingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface SeatLayout {
  zones: string[];
  rows: number;
  seatsPerRow: number;
  seats: SeatType[];
}

function SeatContent() {
  const [layout, setLayout] = useState<SeatLayout>({ 
    zones: [],
    rows: 0,
    seatsPerRow: 0,
    seats: [] 
  });
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [slip, setSlip] = useState<File|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchSeats = useCallback(async () => {
    try {
      const res = await fetch(`/api/seats?artist=${encodeURIComponent('วงไม้เลื้อย')}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLayout({ zones: [], rows: 0, seatsPerRow: 0, seats: [] });
      } else {
        const seats = data.seats.map((s: SeatType) => ({
          ...s,
          rowLabel: s.rowLabel ? s.rowLabel.toUpperCase() : '',
          zone: s.zone || (s.rowLabel && s.rowLabel.charCodeAt(0) <= 74 ? 'VIP' : 'ธรรมดา'),
        }));

        setLayout({
          zones: Array.from(new Set(seats.map((s: SeatType) => s.zone))),
          rows: seats.length > 0 ? Math.max(...seats.map((s: SeatType) => s.rowLabel.charCodeAt(0))) - Math.min(...seats.map((s: SeatType) => s.rowLabel.charCodeAt(0))) + 1 : 0,
          seatsPerRow: seats.length > 0 ? Math.max(...seats.map((s: SeatType) => s.number)) : 0,
          seats
        });
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลที่นั่ง");
      setLayout({ zones: [], rows: 0, seatsPerRow: 0, seats: [] });
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  const getAvailableSeats = () => {
    if (!layout.seats || !Array.isArray(layout.seats)) {
      return { indoor: 0, outdoor: 0 };
    }
    const indoor = layout.seats.filter(seat => seat.zone === 'indoor' && seat.status === 'available').length;
    const outdoor = layout.seats.filter(seat => seat.zone === 'outdoor' && seat.status === 'available').length;
    return { indoor, outdoor };
  };

  const handleSeatSelect = (seat: SeatType) => {
    setSelectedSeats((prev: SeatType[]) => {
      const isSelected = prev.some((s: SeatType) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s: SeatType) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSeats.length) return;

    try {
      const bookingFormData = new FormData();
      bookingFormData.append('firstName', formData.firstName);
      bookingFormData.append('lastName', formData.lastName);
      bookingFormData.append('phone', formData.phone);
      bookingFormData.append('email', formData.email);
      bookingFormData.append('seats', JSON.stringify(selectedSeats));
      bookingFormData.append('artist', 'วงไม้เลื้อย');
      if (slip) {
        bookingFormData.append('slip', slip);
      }
      
      const res = await fetch('/api/booking', {
        method: 'POST',
        body: bookingFormData,
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error) {
          setError(data.error);
        } else {
          setError('เกิดข้อผิดพลาดในการจอง');
        }
        return;
      }
      const bookingIds = (data.bookings || []).map((b: { id: number }) => b.id).join(',');
      router.push(`/payment?bookingIds=${bookingIds}`);
      setShowBookingForm(false);
      setSelectedSeats([]);
      setFormData({ firstName: '', lastName: '', phone: '', email: '' });
      setSlip(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchSeats();
    } catch {
      setError("เกิดข้อผิดพลาดในการจอง");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec] text-black">
      <header className="w-full py-10 bg-[#ffe6f7] shadow-2xl mb-10 border-b-4 border-[#e75480]">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#e75480] text-center drop-shadow-lg tracking-wide mb-2">จองโต๊ะวงไม้เลื้อย</h1>
          <p className="text-2xl text-[#43e97b] text-center mt-2 font-medium">เลือกที่นั่งและชำระเงินออนไลน์ได้ทันที</p>
        </div>
      </header>

      <div className="flex-1 w-full max-w-screen-xl mx-auto px-2 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="rounded-3xl bg-white shadow-2xl p-8 md:p-12 mb-8 w-full border-2 border-[#e75480]">
              <div className="mb-6 flex justify-center gap-8">
                <div className="bg-[#e6ffec] rounded-xl p-4 text-center border-2 border-[#43e97b]">
                  <h3 className="text-lg font-bold text-[#43e97b]">INDOOR</h3>
                  <p className="text-2xl font-bold text-[#43e97b]">{getAvailableSeats().indoor}</p>
                  <p className="text-sm text-[#43e97b]">ที่นั่งคงเหลือ</p>
                </div>
                <div className="bg-[#ffe6f7] rounded-xl p-4 text-center border-2 border-[#e75480]">
                  <h3 className="text-lg font-bold text-[#e75480]">OUTDOOR</h3>
                  <p className="text-2xl font-bold text-[#e75480]">{getAvailableSeats().outdoor}</p>
                  <p className="text-sm text-[#e75480]">ที่นั่งคงเหลือ</p>
                </div>
              </div>
              <SeatMap layout={layout} onSeatSelect={handleSeatSelect} selectedSeats={selectedSeats} />
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="w-full md:w-[360px] md:sticky md:top-8 h-fit">
              <div className="rounded-3xl bg-white shadow-xl p-8 mb-8 border-2 border-[#e75480]">
                <h2 className="mb-4 text-2xl font-bold text-[#e75480] text-center">ที่นั่งที่เลือก</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSeats.map((seat: SeatType) => (
                    <div key={seat.id} className="bg-[#ffe6f7] p-4 rounded-xl border border-[#e75480] shadow text-center">
                      <p className="font-semibold text-[#e75480]">{seat.zone === 'indoor' ? 'INDOOR' : 'OUTDOOR'} ที่นั่ง {seat.rowLabel}{seat.number}</p>
                      <p className="text-[#43e97b] text-lg">฿{seat.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <p className="text-2xl font-bold text-[#43e97b]">รวม: ฿{totalPrice.toLocaleString()}</p>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="mt-4 bg-[#e75480] hover:bg-pink-600 text-white px-8 py-4 rounded-full transition-colors w-full text-xl font-bold shadow-lg border-2 border-[#e75480]"
                  >
                    จองที่นั่ง
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#e75480]">
              <h2 className="text-2xl font-bold mb-4 text-[#e75480] text-center">กรอกข้อมูลการจอง</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-lg font-medium text-[#e75480]">ชื่อ</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-xl border-[#e75480] shadow-sm focus:border-[#e75480] focus:ring-[#e75480] px-4 py-3 text-lg text-black"
                    value={formData.firstName}
                    onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-[#e75480]">นามสกุล</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-xl border-[#e75480] shadow-sm focus:border-[#e75480] focus:ring-[#e75480] px-4 py-3 text-lg text-black"
                    value={formData.lastName}
                    onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-[#e75480]">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    required
                    className="mt-1 block w-full rounded-xl border-[#e75480] shadow-sm focus:border-[#e75480] focus:ring-[#e75480] px-4 py-3 text-lg text-black"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-[#e75480]">อีเมล</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-xl border-[#e75480] shadow-sm focus:border-[#e75480] focus:ring-[#e75480] px-4 py-3 text-lg text-black"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                {error && <div className="text-red-500 mb-2 text-center text-lg">{error}</div>}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-6 py-3 text-[#e75480] hover:text-pink-600 text-lg rounded-full border border-[#e75480] bg-[#ffe6f7]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-[#43e97b] hover:bg-green-400 text-white px-8 py-3 rounded-full transition-colors text-lg font-bold shadow-lg border-2 border-[#43e97b]"
                  >
                    ยืนยันการจอง
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full z-40 md:hidden animate-slide-up">
            <div className="flex items-center justify-between bg-[#ffe6f7]/95 border-t-2 border-[#e75480] px-4 py-3 shadow-2xl rounded-t-2xl">
              <div className="flex flex-wrap gap-2 overflow-x-auto max-w-[60vw]">
                {selectedSeats.map(seat => (
                  <span key={seat.id} className="bg-[#e75480] text-white font-bold px-3 py-1 rounded-full text-sm shadow">{seat.id}</span>
                ))}
              </div>
              <button
                onClick={() => setShowBookingForm(true)}
                className="ml-4 bg-[#e75480] hover:bg-pink-600 text-white px-5 py-2 rounded-full font-bold text-base shadow border-2 border-[#e75480]"
              >
                จองที่นั่ง
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gradient-to-b from-[#ffe6f7] via-[#e6ffec] to-[#ffe6f7] text-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-[#e75480] text-center">ช่องทางการติดต่อ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl mt-1">📞</span>
                  <div>
                    <p className="font-semibold text-[#e75480]">โทรศัพท์</p>
                    <p>0828542779</p>
                    <p>0816613862</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="font-semibold text-[#e75480]">ติดตามเราได้ที่</p>
                <div className="flex space-x-6">
                  <a 
                    href="https://www.facebook.com/majeeder555" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-[#e75480] transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🌐</span>
                    <span>Facebook</span>
                  </a>
                  <a 
                    href="https://line.me/ti/p/-kF-LaE42G" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center space-y-2"
                  >
                    <Image
                      src="/line-footer.jpg?v=1"
                      alt="Line QR Code"
                      width={100}
                      height={100}
                      className="rounded-lg"
                      unoptimized
                    />
                    <span>Line</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-center">© 2025 Thanat Thincheelong. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function SeatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec]">
      <div className="text-2xl font-bold text-[#e75480]">กำลังโหลด...</div>
    </div>}>
      <SeatContent />
    </Suspense>
  );
}
