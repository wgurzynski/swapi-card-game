import {TestBed} from '@angular/core/testing';

import {AppStateService} from './app-state.service';
import {skip} from "rxjs";
import {FIGHT_RESULT, GAME_TYPE, PLAYERS} from "../../models/game.model";

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset game round number on endGame action', (done) => {
    service['_gameRoundNumberSubject$'].next(12);
    service.gameRoundNumber$.pipe(skip(1)).subscribe((roundNumber: number) => {
      expect(roundNumber).toEqual(0);
      done();
    })

    service.endGame(PLAYERS.P1);
  });

  it('should update winning player score on endGame action', (done) => {
    service["_p1Score$"].next(10)
    service.p1Score$.pipe(skip(1)).subscribe((score: number) => {
      expect(score).toEqual(11);
      done();
    })

    service.endGame(PLAYERS.P1);
  });

  it('on endGame action shouldnt update players score if game ends up as draw', (done) => {
    service["_p1Score$"].next(0)
    service.p1Score$.pipe().subscribe((score: number) => {
      expect(score).toEqual(0);
      done();
    })

    service.endGame(FIGHT_RESULT.DRAW);
  });

  it('should update game round number if its equal or smaller than current game type buffer', (done) => {
    service['_gameRoundNumberSubject$'].next(0);
    service['_gameTypeSubject$'].next(GAME_TYPE.PEOPLE);
    service.gameRoundNumber$.pipe(skip(1)).subscribe((roundNumber: number) => {
      expect(roundNumber).toEqual(12);
      done();
    })
    service.updateGameRoundNumber(12)
  });

  it('shouldnt update game round number if its higher than current game type buffer', (done) => {
    service['_gameRoundNumberSubject$'].next(61);
    service['_gameTypeSubject$'].next(GAME_TYPE.PEOPLE);
    service.gameRoundNumber$.pipe(skip(1)).subscribe((roundNumber: number) => {
      expect(roundNumber).toEqual(12);
      done();
    })
    service.updateGameRoundNumber(12)
  });

  it('should trigger stop loading', (done) => {
    service['_isLoading$'].next(true);
    service.isLoading$.pipe(skip(1)).subscribe((isLoading: boolean) => {
        expect(isLoading).toBeFalsy();
        done();
      }
    );

    service.stopLoading();

  });

  it('should trigger start loading', (done) => {
    service['_isLoading$'].next(false);
    service.isLoading$.pipe(skip(1)).subscribe((isLoading: boolean) => {
        expect(isLoading).toBeTruthy();
        done();
      }
    );

    service.setLoading();
  });

  it('it should change game type on changeSelectedEntityType event', (done) => {
    service['_gameTypeSubject$'].next(GAME_TYPE.PEOPLE);
    service.gameType$.pipe(skip(1)).subscribe((gameType: GAME_TYPE) => {
        expect(gameType).toEqual(GAME_TYPE.STARSHIPS);
        done();
      }
    );

    service.changeSelectedEntityType(GAME_TYPE.STARSHIPS);
  });

  it('it should reset gameRoundNumber on changeSelectedEntityType event', (done) => {
    service['_gameRoundNumberSubject$'].next(22);
    service.gameRoundNumber$.pipe(skip(1)).subscribe((roundNumber: number) => {
        expect(roundNumber).toEqual(0);
        done();
      }
    );

    service.changeSelectedEntityType(GAME_TYPE.PLANETS);
  });

  it('should return gameRoundNumber', () => {
    service['_gameRoundNumberSubject$'].next(22);

    expect(service.gameRoundNumber).toEqual(22);
  });

  it('should return selectedGameType', () => {
    service['_gameTypeSubject$'].next(GAME_TYPE.PEOPLE);

    expect(service.selectedGameType).toEqual(GAME_TYPE.PEOPLE);
  });
});
