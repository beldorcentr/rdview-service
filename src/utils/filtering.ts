import { Passage } from '../interfaces';
import { distanceBetweenCoords } from './distance';

export function filterPassagesByDistanceToCoordinates(passages: Passage[],
    lat: number, lon: number, distance: number): Passage[] {
  return passages.filter(passage => {
    return passage.photos.some(photo =>
      distanceBetweenCoords(photo.lat, photo.lon, lat, lon) <= distance);
  });
}

export function filterPassagesByDistanceToKm(passages: Passage[],
    km: number, distance: number): Passage[] {
  return passages.filter(passage => {
    return passage.photos.some(photo => Math.abs(photo.km - km) <= distance);
  });
}
