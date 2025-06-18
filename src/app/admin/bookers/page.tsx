"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Image from 'next/image';

interface Booker {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatId: string;
  status: string;
  paymentSlip?: string;
  createdAt: string;
}

export default function AdminBookersPage() {
  const [bookers, setBookers] = useState<Booker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooker, setEditingBooker] = useState<Booker | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: '',
  });
  const [slipFile, setSlipFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/admin/bookers')
      .then(res => res.json())
      .then(data => setBookers(data.bookers || []))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (booker: Booker) => {
    setEditingBooker(booker);
    setFormData({
      firstName: booker.firstName,
      lastName: booker.lastName,
      email: booker.email,
      phone: booker.phone,
      status: booker.status,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooker) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', String(editingBooker.id));
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('status', formData.status);
      if (slipFile) {
        formDataToSend.append('paymentSlip', slipFile);
      }

      const response = await fetch('/api/admin/bookers/update', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookers(bookers.map(b => 
          b.id === editingBooker.id ? updatedBooking.booking : b
        ));
        setEditingBooker(null);
        setSlipFile(null);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
  };

  const exportToExcel = () => {
    const data = bookers.map(b => ({
      'ชื่อ': b.firstName,
      'นามสกุล': b.lastName,
      'เบอร์โทร': b.phone,
      'เลขที่นั่ง': b.seatId,
      'สถานะ':
        b.status === 'approved' ? 'ชำระเงินสำเร็จ' :
        b.status === 'pending' ? 'รอการยืนยัน' :
        b.status === 'rejected' ? 'ยกเลิก' : b.status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookers');
    XLSX.writeFile(wb, 'bookers.xlsx');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-6xl w-full text-center border border-orange-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-orange-600">จัดการข้อมูลผู้จอง</h1>
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow font-semibold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-3-3m3 3l3-3M4.5 19.5A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v12.75z" />
            </svg>
            Export Excel
          </button>
        </div>
        <Link href="/admin" className="inline-block mb-6 text-orange-500 hover:text-orange-700 font-semibold">← กลับเมนูหลัก</Link>
        {loading ? (
          <div className="text-gray-400">กำลังโหลดข้อมูล...</div>
        ) : (
          <table className="min-w-full border-separate border-spacing-y-2 mx-auto text-sm">
            <thead>
              <tr className="bg-orange-100 text-orange-700 text-base">
                <th className="p-3 rounded-l-xl">ชื่อ-นามสกุล</th>
                <th className="p-3">อีเมล</th>
                <th className="p-3">เบอร์โทร</th>
                <th className="p-3">ที่นั่ง</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3">สลิป</th>
                <th className="p-3">วันที่จอง</th>
                <th className="p-3 rounded-r-xl">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {bookers.map(b => (
                <tr key={b.id} className="bg-orange-50 hover:bg-orange-200 transition">
                  <td className="p-3 font-semibold">{b.firstName} {b.lastName}</td>
                  <td className="p-3">{b.email}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">{b.seatId}</td>
                  <td className="p-3">{b.status}</td>
                  <td className="p-3">
                    {b.paymentSlip ? (
                      <a href={b.paymentSlip} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ดูสลิป</a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">{new Date(b.createdAt).toLocaleString('th-TH')}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleEdit(b)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal แก้ไขข้อมูล */}
      {editingBooker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">แก้ไขข้อมูลผู้จอง</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="waiting_payment">รออัปโหลดสลิป</option>
                  <option value="pending">รอตรวจสอบ</option>
                  <option value="approved">ยืนยันการจองแล้ว</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อัปโหลดสลิปใหม่ (ถ้ามี)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setSlipFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                {editingBooker.paymentSlip && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">สลิปปัจจุบัน:</span>
                    <div className="mt-1">
                      <Image
                        src={editingBooker.paymentSlip}
                        alt="slip"
                        width={200}
                        height={120}
                        className="rounded shadow border"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingBooker(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 