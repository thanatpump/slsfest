"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const artists = [
  { name: 'namkang', image: '/Card01_0.jpg' },
  { name: 'viang', image: '/Card02_0.jpg' },
  { name: 'naruto', image: '/Card03_0.jpg' },
];

export default function SelectArtistPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (selected) {
      router.push(`/seat?artist=${encodeURIComponent(selected)}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#e6ffec] via-[#ffe6f7] to-[#e6ffec] p-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-[#e75480]">เลือกศิลปินที่คุณชื่นชอบ</h1>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {artists.map((artist) => (
          <button
            key={artist.name}
            onClick={() => setSelected(artist.name)}
            className={`overflow-hidden p-0 rounded-2xl border-4 transition-all duration-200 shadow-lg bg-white hover:border-[#e75480] w-40 h-56 md:w-56 md:h-80 ${selected === artist.name ? 'border-[#e75480]' : 'border-transparent'}`}
          >
            <Image 
              src={artist.image} 
              alt={artist.name} 
              width={224} 
              height={320}
              className="w-full h-full object-cover"
              priority
            />
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={!selected}
        className={`px-8 py-3 rounded-full font-bold text-lg shadow-md transition-all duration-200 ${selected ? 'bg-[#e75480] text-white hover:bg-pink-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        ถัดไป
      </button>
    </main>
  );
} 