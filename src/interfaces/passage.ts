import { Photo } from './photo';

export interface Passage {
  id: string;
  date: Date;
  direction: number;
  photos: Photo[];
  kmBegin?: number;
  kmEnd?: number;
}
