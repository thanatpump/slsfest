"use client";
import { Suspense } from 'react';
import PaymentPageContent from './PaymentPageContent';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className='text-center text-blue-600 text-xl mt-20'>กำลังโหลด...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
} 