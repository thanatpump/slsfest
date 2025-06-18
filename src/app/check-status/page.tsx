"use client";
import { useState } from "react";

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

export default function CheckStatusPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingStatus | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/check-status?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("ไม่พบข้อมูลการจองหรือเกิดข้อผิดพลาด");
      const data = await res.json();
      if (!data || !data.status) throw new Error("ไม่พบข้อมูลการจอง");
      setResult(data);
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#00c6fb] text-center mb-6">ตรวจสอบสถานะการจอง</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        {/* แสดงผลลัพธ์ */}
        {error && <div className="mt-6 text-center text-red-500 font-semibold">{error}</div>}
        {result && (
          <div className="mt-6 bg-[#3db6f2]/10 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-[#00c6fb] mb-2">
              สถานะ: {
                result.status === 'approved'
                  ? 'ยืนยันการจองแล้ว'
                  : result.status === 'pending'
                    ? 'รอตรวจสอบ'
                    : result.status === 'waiting_payment'
                      ? 'รออัปโหลดสลิป'
                      : result.status
              }
            </div>
            <div className="text-base text-gray-700 mb-1">ชื่อ: {result.name || "-"}</div>
            <div className="text-base text-gray-700 mb-1">อีเมล: {result.email}</div>
            <div className="text-base text-gray-700 mb-1">เบอร์โทร: {result.phone || "-"}</div>
            <div className="text-base text-gray-700 mb-1">ที่นั่ง/โต๊ะ: {result.seats?.join(", ") || result.table || "-"}</div>
            {typeof result.amount === 'number' && (
              <div className="text-base text-[#00c6fb] font-bold mt-2">จำนวนเงินที่ต้องชำระ: {result.amount.toLocaleString()} บาท</div>
            )}
            {result.note && <div className="text-sm text-gray-500 mt-2">{result.note}</div>}
          </div>
        )}
      </div>
    </main>
  );
} 