import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapComponentApiService {
  apiURL: string = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';

  constructor(private httpClient: HttpClient) {}

  getDataForCircle (lat, lng, radiuskm) {
    return this.httpClient.get(this.apiURL + '&latitude=' + lat + '&longitude=' + lng + '&maxradiuskm=' + radiuskm);
  }

  getDataForMagnitudeSearch(magnitude) {
    return this.httpClient.get(this.apiURL + '&minmagnitude=' + magnitude);
  }

  getDataForLastDay(lastDay, currentDay) {
    return this.httpClient.get(this.apiURL + '&starttime=' + lastDay + '&endtime=' + currentDay);
  }
}