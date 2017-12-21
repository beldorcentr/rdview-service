import axios, { AxiosInstance } from 'axios';
import { Road } from './interfaces';

export interface RoadServiceConfig {
  apiUrl?: string;
  authorization?: string;
}

export class RoadService {

  private apiUrl: string;
  private axios: AxiosInstance;

  constructor({ apiUrl = 'https://i.centr.by/rdview/api',
      authorization = ''
    }: RoadServiceConfig = { }) {

    this.apiUrl = apiUrl;
    this.axios = axios.create({
      headers: {
        'Authorization': authorization
      }
    });
  }

  public getRoads(search: string): Promise<Road[]> {
    return this.axios.get(`${this.apiUrl}/v1/roads`, {
      params: {
        search
      }
    }).then(response => response.data);
  }
}
