"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentPageContent() {
  const searchParams = useSearchParams();
  const bookingIds = searchParams.get('bookingIds');
  const [slip, setSlip] = useState<File|null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number|null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAmount = async () => {
      if (!bookingIds) return;
      try {
        const res = await fetch(`/api/payment/upload-slip?bookingIds=${bookingIds}`);
        const data = await res.json();
        if (res.ok && typeof data.amount === 'number') {
          setAmount(data.amount);
        }
      } catch {}
    };
    fetchAmount();
  }, [bookingIds]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slip || !bookingIds) return;
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('slip', slip);
      formData.append('bookingIds', bookingIds);
      const res = await fetch('/api/payment/upload-slip', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/payment/success');
        return;
      } else {
        setMessage(data.error || 'เกิดข้อผิดพลาดในการอัปโหลด');
      }
    } catch {
      setMessage('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-blue-100 mt-12">
        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-4">ขั้นตอนชำระเงิน</h1>
        <p className="text-lg text-center mb-6">กรุณาชำระเงินตามรายละเอียดด้านล่าง และอัปโหลดสลิปในระบบ</p>
        <div className="bg-blue-50 rounded-xl p-6 mb-6 text-center">
          <div className="text-xl font-bold text-blue-800 mb-2">เลขที่การจอง</div>
          <div className="text-2xl font-mono text-blue-600">{bookingIds}</div>
          {amount !== null && (
            <div className="mt-4 text-lg font-bold text-blue-700">จำนวนเงินที่ต้องชำระ: {amount.toLocaleString()} บาท</div>
          )}
        </div>
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">ข้อมูลบัญชีธนาคาร</h2>
          <div className="space-y-2">
            <p className="text-gray-600">ธนาคารกรุงเทพ</p>
            <p className="text-gray-600">เลขบัญชี: 5000545938</p>
            <p className="text-gray-600">ชื่อบัญชี: ส่องโลกสวย แอ็ดเวอรไทซิ่ง</p>
          </div>
        </div>
        <form onSubmit={handleUpload} className="mt-8 flex flex-col gap-4 items-center">
          <label className="block text-lg font-medium text-gray-700">อัปโหลดสลิปการโอนเงิน</label>
          <input type="file" accept="image/*" onChange={e => setSlip(e.target.files && e.target.files[0])} required className="w-full border rounded-lg px-3 py-2 bg-blue-50 text-lg" />
          <button type="submit" disabled={loading || !slip} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-blue-600 transition-colors text-lg font-bold shadow-lg disabled:opacity-60">
            {loading ? 'กำลังอัปโหลด...' : 'อัปโหลดสลิป'}
          </button>
          {message && <div className="text-center text-blue-700 font-semibold mt-2">{message}</div>}
        </form>
      </div>
    </main>
  );
} 