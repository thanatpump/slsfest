export type SeatStatus = 'available' | 'reserved' | 'occupied';

export interface Seat {
  id: string;
  zone: string;
  rowLabel: string;
  number: number;
  status: SeatStatus;
  price: number;
}

export interface SeatLayout {
  zones: string[];
  rows: number;
  seatsPerRow: number;
  seats: Seat[];
}

export type SeatMatrix = (number | null)[][]; 