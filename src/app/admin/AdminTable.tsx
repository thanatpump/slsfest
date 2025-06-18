'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import React from 'react'

interface Booking {
  id: number;
  seatId: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  paymentSlip?: string;
  status: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzesousztjhoymntujtq.supabase.co';
function getSlipUrl(path: string) {
  if (!path) return '';
  return `${SUPABASE_URL}/storage/v1/object/public/slsfest-slip/${path}`;
}

export default function AdminTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');
      fetchBookings();
    } catch (error) {
      console.error("Error handling booking:", error);
      setError('เกิดข้อผิดพลาด');
    }
  };

  const handleManage = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedBooking) return;
    
    try {
      const res = await fetch(`/api/admin/bookers/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBooking.id,
          firstName: selectedBooking.firstName,
          lastName: selectedBooking.lastName,
          email: '', // ต้องเพิ่ม email ใน interface Booking
          phone: selectedBooking.phone,
          status: status
        }),
      });
      
      if (!res.ok) throw new Error('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating status:", error);
      setError('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold">รายการจองทั้งหมด</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่นั่ง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่จอง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สลิป</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="text-center bg-white shadow rounded-xl">
                  <td className="p-2 font-bold text-blue-700">{b.id}</td>
                  <td className="p-2">{b.seatId}</td>
                  <td className="p-2">{b.firstName} {b.lastName}</td>
                  <td className="p-2">{b.phone}</td>
                  <td className="p-2">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    {b.paymentSlip ? (
                      <button onClick={() => { setModalImage(getSlipUrl(b.paymentSlip!)); setModalOpen(true); }} className="focus:outline-none">
                        <Image 
                          src={getSlipUrl(b.paymentSlip) || ''} 
                          alt="Payment Slip" 
                          width={120} 
                          height={120}
                          className="rounded-lg shadow-md border border-blue-200 hover:scale-105 transition-transform"
                        />
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2">
                    {b.status === 'waiting_payment' && <span className="text-blue-600 font-semibold">รออัปโหลดสลิป</span>}
                    {b.status === 'pending' && <span className="text-yellow-600 font-semibold">รอตรวจสอบ</span>}
                    {b.status === 'approved' && <span className="text-green-600 font-semibold">อนุมัติ</span>}
                    {b.status === 'rejected' && <span className="text-red-600 font-semibold">ไม่อนุมัติ</span>}
                  </td>
                  <td className="p-2">
                    {b.status === 'waiting_payment' && (
                      <button
                        onClick={() => handleManage(b)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        จัดการ
                      </button>
                    )}
                    {b.status === 'pending' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAction(b.id, 'approve')}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'reject')}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                          ไม่อนุมัติ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal แสดงสลิป */}
      {modalOpen && modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">สลิปการชำระเงิน</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Image
              src={modalImage}
              alt="Payment Slip"
              width={800}
              height={800}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Modal จัดการการจอง */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">จัดการการจอง</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p><span className="font-semibold">ID:</span> {selectedBooking.id}</p>
              <p><span className="font-semibold">ชื่อ-นามสกุล:</span> {selectedBooking.firstName} {selectedBooking.lastName}</p>
              <p><span className="font-semibold">เบอร์โทร:</span> {selectedBooking.phone}</p>
              <p><span className="font-semibold">ที่นั่ง:</span> {selectedBooking.seatId}</p>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => handleUpdateStatus('pending')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  ย้ายไปรอตรวจสอบ
                </button>
                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  ยกเลิกการจอง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 