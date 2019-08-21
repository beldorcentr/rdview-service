import { View } from '../interfaces';
import { distanceBetweenCoords } from './distance';

export function getClosestViewByCoords(views: View[], lat: number, lon: number): View {
  return views.reduce((acc, curr) => {
    return distanceBetweenCoords(lat, lon, curr.lat, curr.lon) >
      distanceBetweenCoords(lat, lon, acc.lat, acc.lon) ?
        acc :
        curr;
  });
}

export function getClosestViewByKm(views: View[], km: number): View {
  return views.reduce((acc, curr) => {
    return Math.abs(curr.rdKm - km) > Math.abs(acc.rdKm - km) ?
      acc :
      curr;
  });
}
