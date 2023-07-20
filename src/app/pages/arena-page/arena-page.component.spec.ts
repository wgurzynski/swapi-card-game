import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaPageComponent } from './arena-page.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ArenaService} from "./services/arena.service";
import {Observable, of} from "rxjs";
import {SwapiEntity} from "../../shared/models/swapi-rest.model";

describe('ArenaPageComponent', () => {
  let component: ArenaPageComponent;
  let fixture: ComponentFixture<ArenaPageComponent>;
  let arenaService: ArenaService

  class MockArenaService {
    readonly entities$: Observable<SwapiEntity[][]> = of([]);
    readonly activeBatchCardNumber$: Observable<number> = of(0)
    changeActiveCards(): void {
      jest.fn();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: ArenaService, useClass: MockArenaService}]
    });
    fixture = TestBed.createComponent(ArenaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    arenaService = TestBed.inject(ArenaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger changeActiveCards', () => {
    jest.spyOn(arenaService, 'changeActiveCards');
    jest.spyOn(component, 'generateMockCardImages' as any);
    component.changeActiveCards();

    expect(arenaService.changeActiveCards).toHaveBeenCalledTimes(1);
    expect(component['generateMockCardImages']).toHaveBeenCalledTimes(1);
  });

  it('should generate card images for each card deck', () => {
    component.cardImages = [];
    component.cardDecks = [[],[]];
    component['generateMockCardImages']();

    expect(component.cardImages.length).toEqual(2)
    expect(component.cardImages[0]).toContain('./assets/img/cards/people/people_')
    expect(component.cardImages[1]).toContain('./assets/img/cards/people/people_')
  });
});
