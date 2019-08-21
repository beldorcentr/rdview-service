import { Passage } from '../interfaces';
import { distanceBetweenCoords } from './distance';

export function filterPassagesByDistanceToCoordinates(passages: Passage[],
    lat: number, lon: number, distance: number): Passage[] {
  return passages.filter(passage => {
    return passage.views.some(photo =>
      distanceBetweenCoords(photo.lat, photo.lon, lat, lon) <= distance);
  });
}

export function filterPassagesByDistanceToKm(passages: Passage[],
    km: number, distance: number): Passage[] {
  return passages.filter(passage => {
    return passage.views.some(photo => Math.abs(photo.rdKm - km) <= distance);
  });
}
