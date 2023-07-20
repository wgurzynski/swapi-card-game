import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
import {SwapiRest} from "../../../shared/models/swapi-rest.model";
import {GAME_TYPE} from "../../../shared/models/game.model";

@Injectable({
  providedIn: 'root'
})
export class SwapiServiceRest {

  private readonly apiUrl: string = 'https://swapi.dev/api/';

  constructor(private httpClient: HttpClient) { }

  getEntity(entity: GAME_TYPE, page = 1): Observable<SwapiRest> {
    const params: HttpParams = new HttpParams({ fromObject: { page: page, responseType: 'json'} })

    return this.httpClient.get<SwapiRest>(`${this.apiUrl}${entity}`, { params })
  }
}
