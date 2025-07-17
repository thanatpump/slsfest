"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CronLog {
  timestamp: string;
  message: string;
  expiredCount: number;
  success: boolean;
}

export default function CronSettingsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string>('');
  const [logs, setLogs] = useState<CronLog[]>([]);
  const [message, setMessage] = useState('');

  const testCronJob = async () => {
    setIsRunning(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/cron/reset-expired');
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        setLastRun(new Date().toLocaleString('th-TH'));
        
        // เพิ่ม log
        const newLog: CronLog = {
          timestamp: new Date().toLocaleString('th-TH'),
          message: data.message,
          expiredCount: data.expiredCount,
          success: true
        };
        setLogs(prev => [newLog, ...prev.slice(0, 9)]); // เก็บ 10 log ล่าสุด
      } else {
        setMessage(`❌ ${data.error}`);
        
        const newLog: CronLog = {
          timestamp: new Date().toLocaleString('th-TH'),
          message: data.error,
          expiredCount: 0,
          success: false
        };
        setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      setMessage('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ');
      
      const newLog: CronLog = {
        timestamp: new Date().toLocaleString('th-TH'),
        message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
        expiredCount: 0,
        success: false
      };
      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec] p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#e75480]"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#e75480]">ตั้งค่าระบบรีเซ็ตอัตโนมัติ</h1>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-6 p-4 rounded-lg ${
                message.includes('✅') 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* การตั้งค่า Cron Job */}
            <div className="bg-[#ffe6f7] rounded-xl p-6 border border-[#e75480]">
              <h2 className="text-xl font-bold text-[#e75480] mb-4">การตั้งค่า Cron Job</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#e75480]">คำสั่ง Cron Job:</p>
                  <code className="bg-gray-100 p-2 rounded text-sm block mt-1">
                    */10 * * * * curl -X GET https://your-domain.com/api/cron/reset-expired
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-[#e75480]">ความถี่:</p>
                  <p className="text-gray-700">ทุก 10 นาที</p>
                </div>
                <div>
                  <p className="font-semibold text-[#e75480]">การทำงาน:</p>
                  <p className="text-gray-700">ตรวจสอบและรีเซ็ตการจองที่เกิน 24 ชั่วโมง</p>
                </div>
              </div>
            </div>

            {/* สถานะปัจจุบัน */}
            <div className="bg-[#e6ffec] rounded-xl p-6 border border-[#43e97b]">
              <h2 className="text-xl font-bold text-[#43e97b] mb-4">สถานะปัจจุบัน</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#43e97b]">การทำงานล่าสุด:</p>
                  <p className="text-gray-700">{lastRun || 'ยังไม่มีการทำงาน'}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#43e97b]">สถานะ:</p>
                  <p className="text-gray-700">พร้อมใช้งาน</p>
                </div>
                <button
                  onClick={testCronJob}
                  disabled={isRunning}
                  className={`w-full px-6 py-3 rounded-full font-bold transition-colors ${
                    isRunning
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#43e97b] hover:bg-green-400 text-white'
                  }`}
                >
                  {isRunning ? 'กำลังทดสอบ...' : 'ทดสอบ Cron Job'}
                </button>
              </div>
            </div>
          </div>

          {/* Log การทำงาน */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Log การทำงานล่าสุด</h2>
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">ยังไม่มี log การทำงาน</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      log.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-semibold ${
                          log.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {log.message}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          รีเซ็ต: {log.expiredCount} รายการ
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">คำแนะนำ:</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• ตั้งค่า cron job ให้ทำงานทุก 10 นาที เพื่อรีเซ็ตการจองที่หมดเวลา</li>
              <li>• ระบบจะตรวจสอบ booking ที่ status = "waiting_payment" และหมดเวลา</li>
              <li>• เมื่อรีเซ็ต จะเปลี่ยนสถานะที่นั่งเป็น "available" และ booking เป็น "expired"</li>
              <li>• สามารถทดสอบการทำงานได้ด้วยปุ่ม "ทดสอบ Cron Job"</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 