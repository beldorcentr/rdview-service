import axios, { AxiosInstance } from 'axios';
import { Passage, Photo, Road, Segment } from './interfaces';
import { uuidv4 } from './utils';

export const REQUEST_PASSAGE_DIRECTION = {
  FORWARD: 1,
  BACKWARD: -1,
  BOTH: 0
};

export class RoadSegmentService {

  private apiUrl: string;
  private segmentUrl: string;
  private axios: AxiosInstance;

  constructor(settings: { apiUrl: string, authorization: string }) {
    this.apiUrl = settings.apiUrl;
    this.segmentUrl = `${settings.apiUrl}/v1/segments`;
    this.axios = axios.create({
      headers: {
        'Authorization': settings.authorization
      }
    });
  }

  public getSegmentByRoad(roadId: number, km: number,
      direction: number = REQUEST_PASSAGE_DIRECTION.BOTH): Promise<Segment> {
    return this.axios.get(this.segmentUrl, {
      params: {
        roadId,
        km,
        direction
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
