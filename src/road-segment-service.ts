import axios, { AxiosInstance } from 'axios';
import { Segment } from './interfaces';
import { uuidv4 } from './utils';

export class RoadSegmentService {

  private segmentUrl: string;
  private axios: AxiosInstance;

  constructor(settings: { apiUrl: string, authorization: string }) {
    this.segmentUrl = `${settings.apiUrl}/segments`;
    this.axios = axios.create({
      headers: {
        'Authorization': settings.authorization
      }
    });
  }

  public getSegmentByRoad(roadId: number, beginKm: number, endKm: number): Promise<Segment> {
    return this.axios.get(this.segmentUrl, {
      params: {
        roadId,
        beginKm,
        endKm
      }
    }).then(response => this.formatSegment(response.data));
  }

  public getSegmentByCoordinates(lat: number, lon: number): Promise<Segment> {
    return this.axios.get(this.segmentUrl, {
      params: {
        lat,
        lon
      }
    }).then(response => this.formatSegment(response.data));
  }

  private formatSegment(roadInfo: Segment): Segment {
    if (!roadInfo) {
      return;
    }

    if (!Array.isArray(roadInfo.passages)) {
      return roadInfo;
    }

    roadInfo.passages = roadInfo.passages.map(passage => {
      passage.id = uuidv4();
      passage.date = new Date(passage.date);

      passage.photos = passage.photos.map(photo => {
        photo.date = new Date(photo.date);
        return photo;
      });

      return passage;
    });

    return roadInfo;
  }
}
