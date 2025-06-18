import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const artists = [
  { name: 'namkang', price: { indoor: 1500, outdoor: 1200 } },
  { name: 'viang', price: { indoor: 1200, outdoor: 1000 } },
  { name: 'naruto', price: { indoor: 1000, outdoor: 800 } },
];

const seatRows = [
  // A, B, C
  [null, 'A2', 'A3', 'A4', 'A5', null, 'A6', 'A7', 'A8', 'A9', 'A10'],
  [null, 'B2', 'B3', 'B4', 'B5', null, 'B6', 'B7', 'B8', 'B9', 'B10'],
  [null, 'C2', 'C3', 'C4', 'C5', null, 'C6', 'C7', 'C8', 'C9', 'C10'],
  // D-M
  ...'DEFGHIJKLM'.split('').map(row =>
    ['1','2','3','4','5',null,'6','7','8','9','10'].map(n => n ? `${row}${n}` : null)
  ),
  // N-R
  ...'NQRST'.split('').map(row =>
    ['1','2','3','4','5',null,'6','7','8','9','10'].map(n => n ? `${row}${n}` : null)
  ),
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();

  for (const artistObj of artists) {
    const { name: artist, price } = artistObj;
    for (let rowIdx = 0; rowIdx < seatRows.length; rowIdx++) {
      const rowArr = seatRows[rowIdx];
      const rowLabel = String.fromCharCode(65 + rowIdx);
      // indoor: A-M (0-12), outdoor: N-R (13-17)
      const zone = rowIdx <= 12 ? 'indoor' : 'outdoor';
      for (let colIdx = 0; colIdx < rowArr.length; colIdx++) {
        const seatId = rowArr[colIdx];
        if (!seatId) continue;
        await prisma.seat.create({
          data: {
            id: `${seatId}_${artist}`,
            rowLabel,
            number: parseInt(seatId.slice(1)),
            status: 'available',
            zone,
            price: price[zone],
            artist,
          },
        });
      }
    }
  }
  console.log('Seeded seats complete!');
}

main().finally(() => prisma.$disconnect()); 