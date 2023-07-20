import {TestBed} from '@angular/core/testing';

import {SwapiServiceRest} from './swapi-service-rest.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {GAME_TYPE} from "../../../shared/models/game.model";

describe('SwapiService', () => {
  let service: SwapiServiceRest;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SwapiServiceRest);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should invoke getEnity HTTP call', () => {
    service.getEntity(GAME_TYPE.PEOPLE).subscribe();
    const http: TestRequest = httpMock.expectOne(`https://swapi.dev/api/${GAME_TYPE.PEOPLE}?page=1&responseType=json`);
    expect(http.request.method).toBe('GET');
    expect(http.request.params.get('page')).toBe('1');
    expect(http.request.params.get('responseType')).toBe('json');
  });
});
