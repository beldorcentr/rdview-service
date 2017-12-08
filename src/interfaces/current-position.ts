import { Passage } from './passage';
import { Photo } from './photo';
import { Segment } from './segment';

export interface CurrentPosition extends Segment  {
  currentPassage: Passage;
  currentPhoto: Photo;

  isPassageChanged: boolean;
  isNoNewPhoto: boolean;
  isEmptyResult: boolean;
}
