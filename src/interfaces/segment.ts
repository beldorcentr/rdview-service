import { Passage } from './passage';
import { Road } from './road';

export interface Segment {
  road?: Road;
  rdKmFrom?: number;
  rdKmTo?: number;
  passages?: Passage[];
}
