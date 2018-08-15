import { Passage } from './passage';
import { Road } from './road';

export interface Segment {
  road?: Road;
  beginKm?: number;
  endKm?: number;
  passages?: Passage[];
}
