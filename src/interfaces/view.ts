import { ViewType } from './view-type';

export interface View {
  azimuth: number;
  date: Date;
  id: string;
  lat: number;
  lon: number;
  rdKm: number;
  imgUrl: string;
  viewType: ViewType;
}
