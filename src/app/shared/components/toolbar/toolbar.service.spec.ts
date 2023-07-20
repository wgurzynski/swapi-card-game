import {TestBed} from '@angular/core/testing';
import {ToolbarService} from './toolbar.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ArenaService} from "../../../pages/arena-page/services/arena.service";
import {skip} from "rxjs";
import {ProgressDialogComponent} from "../progress-dialog/progress-dialog.component";
import {AppStateService} from "../../services/app-state/app-state.service";
import {GAME_TYPE} from "../../models/game.model";

describe('ToolbarService', () => {
  let service: ToolbarService;
  let arenaService: ArenaService;
  let appStateService: AppStateService;
  let dialog: MatDialog;

  class MockArenaService {

    clearArenaState(): void {
      jest.fn();
  }
    changeActiveCards(): void {
      jest.fn();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [{provide: ArenaService, useClass: MockArenaService}]
    });
    service = TestBed.inject(ToolbarService);
    arenaService = TestBed.inject(ArenaService);
    appStateService = TestBed.inject(AppStateService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fill progress percentage', (done) => {
    service['_filledProgressPercentageSubject$'].next(service['calculateProgressPercentage'](1));
    service.filledProgressPercentage$.pipe(skip(1)).subscribe((percentage) => {
      expect(percentage).toEqual(2);
      done();
    })

    service.fillProgressPercentage(2);
  });

  it('should change game type if no progress pending', () => {
    jest.spyOn(service, 'changeGameType' as any);
    service.onGameTypeChange(GAME_TYPE.STARSHIPS);

    expect(service['changeGameType']).toHaveBeenCalledTimes(1)
  });

  it('should show progress dialog on gameTypeChange triggered if there is progress pending', () => {
    const dialogConfig = { width: '650px' };

    service['_filledProgressPercentageSubject$'].next(service['calculateProgressPercentage'](1));
    jest.spyOn(dialog, 'open');
    service.onGameTypeChange(GAME_TYPE.STARSHIPS);

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open).toHaveBeenCalledWith(ProgressDialogComponent, dialogConfig);
  });

  it('should clear arena state on change game type action', () => {
    jest.spyOn(arenaService, 'clearArenaState');
    service['changeGameType'](GAME_TYPE.STARSHIPS);

    expect(arenaService['clearArenaState']).toHaveBeenCalledTimes(1);
  });

  it('should change selected entity type in app state on change game type action', () => {
    jest.spyOn(appStateService, 'changeSelectedEntityType');
    service['changeGameType'](GAME_TYPE.STARSHIPS);

    expect(appStateService.changeSelectedEntityType).toHaveBeenCalledTimes(1);
    expect(appStateService.changeSelectedEntityType).toHaveBeenCalledWith(GAME_TYPE.STARSHIPS);
  });

  it('should reset filled progress percentage on change game type action', (done) => {
    service['_filledProgressPercentageSubject$'].next(service['calculateProgressPercentage'](20));
    service.filledProgressPercentage$.pipe(skip(1)).subscribe((percentage) => {
      expect(percentage === 0)
      done();
    })

    service['changeGameType'](GAME_TYPE.STARSHIPS);
  });

  it('should calculate percentage based on selected game type', () => {
    appStateService['_gameTypeSubject$'].next(GAME_TYPE.PEOPLE);
    expect(service['calculateProgressPercentage'](10)).toEqual(12);

    appStateService['_gameTypeSubject$'].next(GAME_TYPE.STARSHIPS);
    expect(service['calculateProgressPercentage'](10)).toEqual(28);

    appStateService['_gameTypeSubject$'].next(GAME_TYPE.PLANETS);
    expect(service['calculateProgressPercentage'](10)).toEqual(17);
  });
});
