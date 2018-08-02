import axios, { AxiosInstance } from 'axios';
import { Road } from './interfaces';

export interface RoadServiceConfig {
  apiUrl?: string;
  authorization?: string;
}

export class RoadService {

  private roadApiUrl: string;
  private axios: AxiosInstance;

  constructor({ apiUrl = 'https://i.centr.by/rdview/api',
      authorization = ''
    }: RoadServiceConfig = { }) {

    this.roadApiUrl = `${apiUrl}/v1.1/roads`;
    this.axios = axios.create({
      headers: {
        'Authorization': authorization
      }
    });
  }

  public getRoads(search: string): Promise<Road[]> {
    return this.axios.get(this.roadApiUrl, {
      params: {
        search
      }
    }).then(response => response.data);
  }
}
