import { Passage } from './passage';
import { Road } from './road';

export interface Segment extends Road {
  kmBegin: number;
  kmEnd: number;
  passages: Passage[];
}
