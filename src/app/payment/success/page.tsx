"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-blue-100 mt-12 text-center">
        <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto mb-4">
          <circle cx="32" cy="32" r="32" fill="#22c55e" />
          <path d="M18 34l10 10 18-18" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <h1 className="text-3xl font-extrabold text-green-600 mb-4">ชำระเงินสำเร็จ!</h1>
        <p className="text-lg text-gray-700 mb-6">รอตรวจสอบโดยแอดมินภายใน 24 ชั่วโมง<br />หากมีปัญหาติดต่อเจ้าหน้าที่</p>
        <Link href="/" className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-blue-600 transition-colors text-lg font-bold shadow-lg">
          กลับหน้าแรก
        </Link>
        <div className="mt-4 text-gray-400 text-sm">จะกลับหน้าแรกอัตโนมัติใน 10 วินาที...</div>
      </div>
    </main>
  );
} 