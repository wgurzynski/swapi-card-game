import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {ToolbarComponent} from "./shared/components/toolbar/toolbar.component";
import {Observable, of} from "rxjs";
import {SwapiEntity} from "./shared/models/swapi-rest.model";
import {ArenaService} from "./pages/arena-page/services/arena.service";

describe('AppComponent', () => {
  class MockArenaService {
    readonly entities$: Observable<SwapiEntity[][]> = of([]);
    readonly activeBatchCardNumber$: Observable<number> = of(0)
    changeActiveCards(): void {
      jest.fn();
    }
  }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, ToolbarComponent],
    declarations: [AppComponent],
    providers: [{provide: ArenaService, useClass: MockArenaService}]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'swapi-card-game'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('swapi-card-game');
  });
});
