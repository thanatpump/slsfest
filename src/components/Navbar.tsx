"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white/20 backdrop-blur-md shadow-md px-4 md:px-6 py-2 flex items-center justify-between sticky top-0 z-50 border-b-2 border-[#00b894] h-14 md:h-16">
      {/* Desktop Navbar */}
      <div className="w-full max-w-screen-lg mx-auto items-center justify-between hidden md:flex">
        {/* ซ้าย */}
        <div className="flex gap-2 md:gap-4 items-center">
        <Link href="/">
            <span className="text-lg font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">หน้าแรก</span>
        </Link>
        <Link href="/seat?artist=วงไม้เลื้อย">
            <span className="text-lg font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">จองโต๊ะวงไม้เลื้อย</span>
        </Link>
        </div>
        {/* กลาง */}
        <div className="flex-1 flex justify-center relative z-20">
          <Image
            src="/logo.png?v=1"
            alt="SLS Logo"
            width={300}
            height={300}
            className="h-0 w-auto mt-4 md:h-40 md:mt-8 mx-auto drop-shadow-xl"
            priority
            unoptimized
          />
        </div>
        {/* ขวา */}
        <div className="flex gap-2 md:gap-4 items-center">
        <Link href="/check-status">
            <span className="text-lg font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">ตรวจสอบสถานะ</span>
        </Link>
        <Link href="/register/payment/verify">
            <span className="text-lg font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">ยืนยันการชำระเงิน</span>
        </Link>
        </div>
      </div>
      {/* Mobile Hamburger */}
      <div className="flex w-full items-center justify-between md:hidden">
        <button className="p-2 rounded border border-white/40 hover:bg-white/20" onClick={() => setOpen(v => !v)} aria-label="เมนู">
          <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2">
          <path d="M4 7h20M4 14h20M4 21h20" />
        </svg>
      </button>
        <Image
          src="/logo.png?v=1"
          alt="SLS Logo"
          width={180}
          height={180}
          className="h-28 w-auto mt-4 mx-auto drop-shadow-xl"
          priority
          unoptimized
        />
      </div>
      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-14 left-2 right-2 bg-white/90 backdrop-blur-md border border-white/40 rounded-xl shadow-lg flex flex-col items-stretch py-2 px-4 gap-2 md:hidden animate-fade-in z-50">
          <Link href="/" onClick={() => setOpen(false)}>
            <span className="block text-base font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">หน้าแรก</span>
          </Link>
          <Link href="/seat?artist=วงไม้เลื้อย" onClick={() => setOpen(false)}>
            <span className="block text-base font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">จองโต๊ะวงไม้เลื้อย</span>
          </Link>
          <Link href="/check-status" onClick={() => setOpen(false)}>
            <span className="block text-base font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">ตรวจสอบสถานะ</span>
          </Link>
          <Link href="/register/payment/verify" onClick={() => setOpen(false)}>
            <span className="block text-base font-semibold text-black hover:text-[#00b894] hover:bg-white/30 transition-colors rounded-full px-4 py-2 cursor-pointer">ยืนยันการชำระเงิน</span>
          </Link>
        </div>
      )}
    </nav>
  );
} 