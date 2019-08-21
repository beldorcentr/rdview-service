import {
  sortPassagesByDateAsc, sortPassagesByDateDesc,
  sortPassagesByDistanceToKm, sortPhotosByKmAsc, sortPhotosByKmDesc
} from '../../src/utils';
import { passages } from '../moqs/passages';
import { views } from '../moqs/views';

describe('sortPhotosByKm', () => {
  it('should sort photos by km asc', () => {
    const sortedByKmPhotos = sortPhotosByKmAsc(views);
    sortedByKmPhotos.reduce((acc, curr) => {
      expect(acc.rdKm).toBeLessThanOrEqual(curr.rdKm);
      return curr;
    });
  });

  it('should sort photos by km desc', () => {
    const sortedByKmPhotos = sortPhotosByKmDesc(views);
    sortedByKmPhotos.reduce((acc, curr) => {
      expect(acc.rdKm).toBeGreaterThanOrEqual(curr.rdKm);
      return curr;
    });
  });
});

describe('sortPassagesByDate', () => {
  it('should sort photos by date asc', () => {
    const sortedByDatePassages = sortPassagesByDateAsc(passages);
    sortedByDatePassages.reduce((acc, curr) => {
      expect(acc.date.getTime()).toBeLessThanOrEqual(curr.date.getTime());
      return curr;
    });
  });

  it('should sort photos by date desc', () => {
    const sortedByDatePassages = sortPassagesByDateDesc(passages);
    sortedByDatePassages.reduce((acc, curr) => {
      expect(acc.date.getTime()).toBeGreaterThanOrEqual(curr.date.getTime());
      return curr;
    });
  });
});
