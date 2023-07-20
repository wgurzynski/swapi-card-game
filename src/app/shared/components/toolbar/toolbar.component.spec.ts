import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ToolbarComponent} from './toolbar.component';
import {ArenaService} from "../../../pages/arena-page/services/arena.service";
import {Observable, of} from "rxjs";
import {SwapiEntity} from "../../models/swapi-rest.model";
import {ToolbarService} from "./toolbar.service";
import {GAME_TYPE} from "../../models/game.model";

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let service: ToolbarService;

  class MockArenaService {
    readonly entities$: Observable<SwapiEntity[][]> = of([]);
    readonly activeBatchCardNumber$: Observable<number> = of(0)
    changeActiveCards(): void {
      jest.fn();
    }
  }

  class MockToolbarService {
    onGameTypeChange(): void {
      jest.fn();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ArenaService, useClass: MockArenaService}, {provide: ToolbarService, useClass: MockToolbarService}]
    });
    fixture = TestBed.createComponent(ToolbarComponent);
    service = TestBed.inject(ToolbarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger game type change', () => {
    jest.spyOn(service, 'onGameTypeChange');

    component.onGameTypeChange(GAME_TYPE.STARSHIPS);
    expect(service.onGameTypeChange).toHaveBeenCalledTimes(1);
    expect(service.onGameTypeChange).toHaveBeenCalledWith(GAME_TYPE.STARSHIPS);
  });
});
