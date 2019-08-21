import { View, ViewType } from '../../src/interfaces';

export const views: View[] = [
  {
    azimuth: 50,
    date: new Date(),
    viewType: ViewType.TwoDimensional,
    id: '1',
    lat: 0,
    lon: 0,
    rdKm: 20,
    imgUrl: 'http://img1.net'
  },
  {
    azimuth: 50,
    date: new Date(),
    viewType: ViewType.TwoDimensional,
    id: '2',
    lat: 0,
    lon: 10,
    rdKm: 10,
    imgUrl: 'http://img2.net'
  },
  {
    azimuth: 50,
    date: new Date(),
    viewType: ViewType.TwoDimensional,
    id: '3',
    lat: 0,
    lon: 50,
    rdKm: 50,
    imgUrl: 'http://img3.net'
  }
];
