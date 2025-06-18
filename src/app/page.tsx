"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CountdownTimer from '../components/CountdownTimer';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec] p-0 m-0 text-black">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[900px] flex flex-col justify-start items-center p-0 m-0 bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec]">
        <div className="absolute inset-0">
          <Image
            src="/concert-bg.png"
            alt="Concert Background"
            fill
            className="object-center object-cover opacity-95"
            sizes="100vw"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-white/30" />
        </div>
        
        <motion.div
          className="relative z-10 w-full flex flex-col items-center justify-center py-8 md:py-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex items-center justify-center h-full w-full mt-4 md:mt-[-60px]">
            <Image
              src="/sls-cel.png"
              alt="SLS Cel Logo"
              width={2000}
              height={2000}
              className="object-contain w-full h-full max-w-[100vw] max-h-[70vh]"
              priority
            />
          </div>
          <motion.div variants={itemVariants} className="relative z-10 flex justify-center w-full max-w-2xl mx-auto mt-8">
            <Link 
              href="/select-artist"
              className="inline-block w-auto bg-[#00b894] hover:bg-[#43e97b] text-white font-bold py-2 md:py-4 px-4 md:px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-[#00c6fb]"
            >
              จองตั๋ว
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-10 md:py-20 bg-gradient-to-b from-[#ffe6f7] via-[#e6ffec] to-[#ffe6f7]">
        <motion.div
          className="container mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-black mb-4 md:mb-6">นับถอยหลังสู่คอนเสิร์ต</h2>
            <p className="text-base md:text-xl text-gray-400"></p>
        </div>
          <CountdownTimer />
        </motion.div>
      </section>

      {/* Event Info Section */}
      <section className="py-12 md:py-32 bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec]">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-[#e75480]">รายละเอียดคอนเสิร์ต</h2>
          <motion.div
            className="bg-white rounded-3xl p-4 md:p-12 shadow-xl border-2 border-[#e75480]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                <div className="flex-1">
                  <h3 className="text-lg md:text-2xl font-bold text-[#e75480] mb-2 md:mb-4">วันและเวลา</h3>
                  <p className="text-base md:text-xl text-black">20 มิถุนายน - สิงหาคม</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-2xl font-bold text-[#e75480] mb-2 md:mb-4">สถานที่</h3>
                  <p className="text-base md:text-xl text-black">ลานตลาดวิถีชุมชนซับสะเลเต ก่อนถึง อุทยานแห่งชาติป่าหินงาม.</p>
                </div>
              </div>

              <div className="border-t border-[#e75480]/30 pt-6 md:pt-8">
                <h3 className="text-lg md:text-2xl font-bold text-[#e75480] mb-4 md:mb-6">ประเภทบัตรเข้าชมและค่าสมัคร</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* บัตร น้ำแข็ง ทิพวรรณ */}
                  <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg border-2 border-[#e75480] relative overflow-hidden group flex flex-col h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e75480]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <h4 className="text-base md:text-xl font-bold text-black mb-1 md:mb-2">บัตร น้ำแข็ง ทิพวรรณ</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">1,500 บาท</p>
                          <p className="text-sm text-gray-600 mb-2">โซน Indoor</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              สำหรับ 4 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์สด 1 ทาวเวอร์
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">1,200 บาท</p>
                          <p className="text-sm text-gray-600 mb-2">โซน Outdoor</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              สำหรับ 4 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์สด 1 ทาวเวอร์
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">150 บาท</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              บัตรสำหรับ 1 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์ 1 กระป๋องใหญ่
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* จอดโต๊ะ เวียง นฤมล */}
                  <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg border-2 border-[#e75480] relative overflow-hidden group flex flex-col h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e75480]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <h4 className="text-base md:text-xl font-bold text-black mb-1 md:mb-2">จอดโต๊ะ เวียง นฤมล</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">1,200 บาท</p>
                          <p className="text-sm text-gray-600 mb-2">โซน Indoor</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              สำหรับ 4 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์สด 1 ทาวเวอร์
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">1,000 บาท</p>
                          <p className="text-sm text-gray-600 mb-2">โซน Outdoor</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              สำหรับ 4 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์สด 1 ทาวเวอร์
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* บัตร วงไม้เลื้อย */}
                  <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg border-2 border-[#e75480] relative overflow-hidden group flex flex-col h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e75480]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <h4 className="text-base md:text-xl font-bold text-black mb-1 md:mb-2">บัตร วงไม้เลื้อย</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">1,000 บาท</p>
                          <p className="text-sm text-gray-600 mb-2">โซน Indoor</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              สำหรับ 4 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์สด 1 ทาวเวอร์
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">800 บาท</p>
                          <p className="text-sm text-gray-600 mb-2">โซน Outdoor</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              สำหรับ 4 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์สด 1 ทาวเวอร์
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-xl md:text-2xl font-bold text-[#e75480] mb-2">150 บาท</p>
                          <ul className="text-gray-800 space-y-1">
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              บัตรสำหรับ 1 ท่าน
                            </li>
                            <li className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#e75480]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              เบียร์ 1 กระป๋องใหญ่
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="bg-gradient-to-b from-[#ffe6f7] via-[#e6ffec] to-[#ffe6f7] text-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-[#e75480] text-center">ช่องทางการติดต่อ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl mt-1">📞</span>
                  <div>
                    <p className="font-semibold text-[#e75480]">โทรศัพท์</p>
                    <p>0828542779</p>
                    <p>0816613862</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-semibold text-[#e75480]">ติดตามเราได้ที่</p>
                <div className="flex space-x-6">
                  <a 
                    href="https://www.facebook.com/majeeder555" 
          target="_blank"
          rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-[#e75480] transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🌐</span>
                    <span>Facebook</span>
        </a>
        <a
                    href="https://line.me/ti/p/-kF-LaE42G" 
          target="_blank"
          rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-[#e75480] transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                    <span>Line</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-center">© 2025 Thanat Thincheelong. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
