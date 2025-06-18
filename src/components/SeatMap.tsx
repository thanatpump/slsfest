import { motion } from 'framer-motion';
import { Seat, SeatLayout } from '@/types/seat';
import { useSearchParams } from 'next/navigation';

interface SeatMapProps {
  layout: SeatLayout;
  onSeatSelect: (seat: Seat) => void;
  selectedSeats?: Seat[];
  adminMode?: boolean;
}

// seatRows ใหม่
const seatRows = [
  [null, 'A2', 'A3', 'A4', 'A5', null, 'A6', 'A7', 'A8', 'A9', 'A10'],
  [null, 'B2', 'B3', 'B4', 'B5', null, 'B6', 'B7', 'B8', 'B9', 'B10'],
  [null, 'C2', 'C3', 'C4', 'C5', null, 'C6', 'C7', 'C8', 'C9', 'C10'],
  ...'DEFGHIJKLM'.split('').map(row =>
    ['1','2','3','4','5',null,'6','7','8','9','10'].map(n => n ? `${row}${n}` : null)
  ),
  ...'NQRST'.split('').map(row =>
    ['1','2','3','4','5',null,'6','7','8','9','10'].map(n => n ? `${row}${n}` : null)
  ),
];

export default function SeatMap({ layout, onSeatSelect, selectedSeats = [], adminMode = false }: SeatMapProps) {
  const searchParams = useSearchParams();
  const artist = searchParams.get('artist') || '';

  if (!layout.seats || !Array.isArray(layout.seats) || layout.seats.length === 0) {
    return <div className="text-center text-gray-500">ไม่มีข้อมูลที่นั่ง</div>;
  }

  const getSeatColor = (status: Seat['status'], isSelected: boolean) => {
    if (isSelected) return 'bg-blue-500 hover:bg-blue-600 relative';
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'reserved':
        return 'bg-yellow-500';
      case 'occupied':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // indoor: 0-12, outdoor: 13-17
  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">แผนผังที่นั่ง</h2>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500"></div>
            <span>ว่าง</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-yellow-500"></div>
            <span>ติดจอง</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-red-500"></div>
            <span>โต๊ะถูกจอง</span>
          </div>
        </div>
      </div>
      {/* เวทีคอนเสิร์ต */}
      <div className="w-full flex justify-center mb-8">
        <svg width="100%" height="90" viewBox="0 0 800 90" className="block">
          <defs>
            <linearGradient id="stageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M20,80 Q400,10 780,80"
            fill="url(#stageGradient)"
            stroke="#2563eb"
            strokeWidth="4"
          />
          <text x="400" y="88" textAnchor="middle" fontSize="20" fill="#222" fontFamily="inherit">
            เวทีคอนเสิร์ต
          </text>
        </svg>
      </div>
      {/* ผังที่นั่งจริง */}
      <div className="w-full max-w-full overflow-x-auto">
        <div className="w-max mx-auto flex flex-col gap-2 md:gap-4 items-center">
          {/* Label INDOOR */}
          <div className="w-full flex justify-center mb-1">
            <div className="bg-green-100/80 rounded-full px-6 py-1 text-green-700 font-bold text-lg shadow border border-green-300">INDOOR (A-M)</div>
          </div>
          {/* แถบสี INDOOR */}
          <div className="w-full flex flex-col items-center bg-green-300/40 rounded-xl py-2 mb-2 gap-2 md:gap-4 relative overflow-hidden">
            {seatRows.slice(0, 13).map((row, rowIdx) => (
              <div key={rowIdx} className="flex flex-row gap-px md:gap-3 justify-center items-center z-10">
                <span className="w-6 text-right text-xs text-gray-500 mr-1 select-none">{String.fromCharCode(65 + rowIdx)}</span>
                {row.map((seatId, colIdx) =>
                  seatId ? (
                    (() => {
                      const seat = layout.seats.find(s => s.id === `${seatId}_${artist}`);
                      if (!seat) return <div key={colIdx} className="h-4 w-6 md:h-7 md:w-14" />;
                      const isSelected = selectedSeats.some(s => s.id === seat.id);
                      return (
                        <motion.button
                          key={colIdx}
                          className={`h-4 w-4 md:h-7 md:w-7 flex items-center justify-center rounded ${getSeatColor(seat.status, isSelected)} transition-colors text-[8px] md:text-xs font-bold`}
                          onClick={() => onSeatSelect(seat)}
                          disabled={!adminMode && (seat.status === 'occupied' || seat.status === 'reserved')}
                          title={`INDOOR ที่นั่ง ${seat.rowLabel}${seat.number}`}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <span className={isSelected ? "opacity-0" : ""}>{seat.number}</span>
                          {isSelected && (
                            <svg 
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </motion.button>
                      );
                    })()
                  ) : (
                    <div key={colIdx} className="h-4 w-4 md:h-7 md:w-7" />
                  )
                )}
              </div>
            ))}
          </div>
          {/* Label OUTDOOR */}
          <div className="w-full flex justify-center mb-1 mt-2">
            <div className="bg-pink-100/80 rounded-full px-6 py-1 text-pink-700 font-bold text-lg shadow border border-pink-300">OUTDOOR (N-R)</div>
          </div>
          {/* แถบสี OUTDOOR */}
          <div className="w-full flex flex-col items-center bg-pink-200/40 rounded-xl py-2 gap-2 md:gap-4">
            {seatRows.slice(13).map((row, rowIdx) => (
              <div key={rowIdx + 13} className="flex flex-row gap-px md:gap-3 justify-center items-center">
                <span className="w-6 text-right text-xs text-gray-500 mr-1 select-none">{String.fromCharCode(65 + rowIdx + 13)}</span>
                {row.map((seatId, colIdx) =>
                  seatId ? (
                    (() => {
                      const seat = layout.seats.find(s => s.id === `${seatId}_${artist}`);
                      if (!seat) return <div key={colIdx} className="h-4 w-4 md:h-7 md:w-7" />;
                      const isSelected = selectedSeats.some(s => s.id === seat.id);
                      return (
                        <motion.button
                          key={colIdx}
                          className={`h-4 w-4 md:h-7 md:w-7 flex items-center justify-center rounded ${getSeatColor(seat.status, isSelected)} transition-colors text-[8px] md:text-xs font-bold`}
                          onClick={() => onSeatSelect(seat)}
                          disabled={!adminMode && (seat.status === 'occupied' || seat.status === 'reserved')}
                          title={`OUTDOOR ที่นั่ง ${seat.rowLabel}${seat.number}`}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <span className={isSelected ? "opacity-0" : ""}>{seat.number}</span>
                          {isSelected && (
                            <svg 
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </motion.button>
                      );
                    })()
                  ) : (
                    <div key={colIdx} className="h-4 w-4 md:h-7 md:w-7" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 