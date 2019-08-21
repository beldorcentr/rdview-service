import { Direction } from './direction';
import { View } from './view';
import { ViewType } from './view-type';

export interface Passage {
  id: string;
  date: Date;
  direction: Direction;
  viewType: ViewType;
  views: View[];
  rdKmFrom: number;
  rdKmTo: number;
}
