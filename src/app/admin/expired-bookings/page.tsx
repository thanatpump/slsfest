"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ExpiredBooking {
  id: number;
  seatId: string;
  seatInfo: string;
  customerName: string;
  phone: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  artist: string;
}

export default function ExpiredBookingsPage() {
  const [expiredBookings, setExpiredBookings] = useState<ExpiredBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchExpiredBookings = async () => {
    try {
      const response = await fetch('/api/booking/expire');
      const data = await response.json();
      
      if (response.ok) {
        setExpiredBookings(data.expiredBookings || []);
      } else {
        setMessage('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    } catch {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const handleResetExpired = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/booking/expire', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        // รีเฟรชข้อมูลหลังจากรีเซ็ต
        await fetchExpiredBookings();
      } else {
        setMessage('เกิดข้อผิดพลาดในการรีเซ็ตการจอง');
      }
    } catch {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpiredBookings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#e75480]">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec] p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#e75480]"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#e75480]">การจองที่หมดเวลา</h1>
            <div className="flex gap-4">
              <button
                onClick={fetchExpiredBookings}
                className="bg-[#43e97b] hover:bg-green-400 text-white px-6 py-3 rounded-full font-bold transition-colors"
              >
                รีเฟรช
              </button>
              <button
                onClick={handleResetExpired}
                disabled={refreshing || expiredBookings.length === 0}
                className={`px-6 py-3 rounded-full font-bold transition-colors ${
                  refreshing || expiredBookings.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#e75480] hover:bg-pink-600 text-white'
                }`}
              >
                {refreshing ? 'กำลังรีเซ็ต...' : 'รีเซ็ตการจองที่หมดเวลา'}
              </button>
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
            >
              {message}
            </motion.div>
          )}

          {expiredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-[#43e97b] mb-2">ไม่มีการจองที่หมดเวลา</h2>
              <p className="text-gray-600">ทุกการจองยังอยู่ในช่วงเวลาที่กำหนด</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#ffe6f7]">
                    <th className="border border-[#e75480] p-3 text-left font-bold text-[#e75480]">ที่นั่ง</th>
                    <th className="border border-[#e75480] p-3 text-left font-bold text-[#e75480]">ชื่อลูกค้า</th>
                    <th className="border border-[#e75480] p-3 text-left font-bold text-[#e75480]">เบอร์โทร</th>
                    <th className="border border-[#e75480] p-3 text-left font-bold text-[#e75480]">อีเมล</th>
                    <th className="border border-[#e75480] p-3 text-left font-bold text-[#e75480]">เวลาจอง</th>
                    <th className="border border-[#e75480] p-3 text-left font-bold text-[#e75480]">หมดเวลา</th>
                    <th className="border border-[#e75480] p-3 text-left font-bold text-[#e75480]">ศิลปิน</th>
                  </tr>
                </thead>
                <tbody>
                  {expiredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-[#ffe6f7]/50"
                    >
                      <td className="border border-[#e75480] p-3 font-semibold text-[#e75480]">
                        {booking.seatInfo}
                      </td>
                      <td className="border border-[#e75480] p-3">{booking.customerName}</td>
                      <td className="border border-[#e75480] p-3">{booking.phone}</td>
                      <td className="border border-[#e75480] p-3">{booking.email}</td>
                      <td className="border border-[#e75480] p-3 text-sm">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="border border-[#e75480] p-3 text-sm text-red-600 font-semibold">
                        {formatDate(booking.expiresAt)}
                      </td>
                      <td className="border border-[#e75480] p-3">{booking.artist}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">คำอธิบาย:</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• การจองที่หมดเวลา = การจองที่เกิน 24 ชั่วโมงและยังไม่ได้ชำระเงิน</li>
              <li>• การรีเซ็ตจะทำให้ที่นั่งกลับมาเป็น &quot;ว่าง&quot; และการจองเป็น &quot;หมดเวลา&quot;</li>
              <li>• ควรตรวจสอบและรีเซ็ตเป็นประจำเพื่อให้ที่นั่งว่างสำหรับลูกค้าคนอื่น</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 