"use client";

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-08-16T18:00:00+07:00');

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 md:gap-8 max-w-4xl mx-auto">
      <div className="bg-[#e0f7fa]/80 backdrop-blur-lg rounded-xl p-2 md:p-6 text-center min-w-[60px] md:min-w-[120px] border-2 border-[#00b894]">
        <div className="text-2xl md:text-6xl font-bold text-[#00b894] mb-1 md:mb-2">{timeLeft.days}</div>
        <div className="text-xs md:text-lg text-[#00b894]">วัน</div>
      </div>
      <div className="text-2xl md:text-4xl font-bold text-[#00c6fb]">:</div>
      <div className="bg-[#e0f7fa]/80 backdrop-blur-lg rounded-xl p-2 md:p-6 text-center min-w-[60px] md:min-w-[120px] border-2 border-[#00b894]">
        <div className="text-2xl md:text-6xl font-bold text-[#00b894] mb-1 md:mb-2">{timeLeft.hours}</div>
        <div className="text-xs md:text-lg text-[#00b894]">ชั่วโมง</div>
      </div>
      <div className="text-2xl md:text-4xl font-bold text-[#00c6fb]">:</div>
      <div className="bg-[#e0f7fa]/80 backdrop-blur-lg rounded-xl p-2 md:p-6 text-center min-w-[60px] md:min-w-[120px] border-2 border-[#00b894]">
        <div className="text-2xl md:text-6xl font-bold text-[#00b894] mb-1 md:mb-2">{timeLeft.minutes}</div>
        <div className="text-xs md:text-lg text-[#00b894]">นาที</div>
      </div>
      <div className="text-2xl md:text-4xl font-bold text-[#00c6fb]">:</div>
      <div className="bg-[#e0f7fa]/80 backdrop-blur-lg rounded-xl p-2 md:p-6 text-center min-w-[60px] md:min-w-[120px] border-2 border-[#00b894]">
        <div className="text-2xl md:text-6xl font-bold text-[#00b894] mb-1 md:mb-2">{timeLeft.seconds}</div>
        <div className="text-xs md:text-lg text-[#00b894]">วินาที</div>
      </div>
    </div>
  );
} 