"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingStatus {
  status: string;
  name?: string;
  email: string;
  phone?: string;
  seats?: string[];
  table?: string;
  note?: string;
  amount?: number;
}

export default function VerifyPaymentPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [slip, setSlip] = useState<File | null>(null);
  const router = useRouter();

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBooking(null);
    try {
      const res = await fetch(`/api/check-status?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("ไม่พบข้อมูลการจองหรือเกิดข้อผิดพลาด");
      const data = await res.json();
      if (!data || !data.status) throw new Error("ไม่พบข้อมูลการจอง");
      if (data.status !== 'waiting_payment') {
        throw new Error("การจองนี้ไม่ต้องอัปโหลดสลิปแล้ว");
      }
      setBooking(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slip) {
      setError("กรุณาเลือกไฟล์สลิป");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('slip', slip);
      const res = await fetch('/api/upload-slip', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("อัปโหลดสลิปไม่สำเร็จ");
      router.push('/check-status');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#3db6f2] to-[#43e97b] py-10 px-2">
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 w-full max-w-md mt-10">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00c6fb] text-center mb-6">ยืนยันการชำระเงิน</h1>
        
        {!booking ? (
          <form onSubmit={handleCheckEmail} className="flex flex-col gap-4">
            <label className="font-semibold text-gray-700">อีเมลที่ใช้จอง</label>
            <input
              type="email"
              className="border border-[#00c6fb] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-base"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#3db6f2] to-[#43e97b] hover:from-[#00c6fb] hover:to-[#00b894] text-white font-bold py-2 rounded transition-colors mt-2 disabled:opacity-50"
              disabled={loading || !email}
            >
              {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบ"}
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="bg-[#3db6f2]/10 rounded-xl p-4 mb-4">
                <div className="text-base text-gray-700 mb-1">ชื่อ: {booking.name || "-"}</div>
                <div className="text-base text-gray-700 mb-1">อีเมล: {booking.email}</div>
                <div className="text-base text-gray-700 mb-1">เบอร์โทร: {booking.phone || "-"}</div>
                <div className="text-base text-gray-700 mb-1">ที่นั่ง: {booking.seats?.join(", ") || "-"}</div>
                {typeof booking.amount === 'number' && (
                  <div className="text-base text-[#00c6fb] font-bold mt-2">จำนวนเงินที่ต้องชำระ: {booking.amount.toLocaleString()} บาท</div>
                )}
              </div>
              <div className="bg-white rounded-xl p-4 mb-2 border border-[#00c6fb] flex flex-col items-center">
                <div className="font-semibold text-[#00c6fb]">ธนาคารกรุงเทพ</div>
                <div className="text-lg font-bold text-[#00c6fb] tracking-widest my-1">5000545938</div>
                <div className="text-sm text-gray-600 text-center">ชื่อบัญชี: ส่องโลกสวย แอ็ดเวอรไทซิ่ง</div>
              </div>
              <label className="font-semibold text-gray-700">อัปโหลดสลิปการโอนเงิน</label>
              <input
                type="file"
                accept="image/*"
                className="border border-[#00c6fb] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-base"
                onChange={e => setSlip(e.target.files?.[0] || null)}
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#3db6f2] to-[#43e97b] hover:from-[#00c6fb] hover:to-[#00b894] text-white font-bold py-2 rounded transition-colors mt-2 disabled:opacity-50"
                disabled={loading || !slip}
              >
                {loading ? "กำลังอัปโหลด..." : "อัปโหลดสลิป"}
              </button>
            </form>
          </>
        )}
        
        {error && <div className="mt-6 text-center text-red-500 font-semibold">{error}</div>}
      </div>
    </main>
  );
} 