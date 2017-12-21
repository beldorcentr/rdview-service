import { Photo } from './photo';

export interface Passage {
  id: string;
  date: Date;
  direction: 'forward' | 'backward';
  photos: Photo[];
  beginKm: number;
  endKm: number;
}
