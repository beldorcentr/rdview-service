import { Passage } from './passage';
import { Segment } from './segment';
import { View } from './view';

export interface CurrentPosition extends Segment  {
  currentPassage?: Passage;
  currentView?: View;

  closeToCurrentRdKmFrom?: number;
  closeToCurrentRdKmTo?: number;
  closeToCurrentPassages?: Passage[];

  isPassageChanged?: boolean;
  isNoNewPhoto?: boolean;
  isEmptyResult: boolean;
}
