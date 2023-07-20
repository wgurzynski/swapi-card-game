import {TestBed} from '@angular/core/testing';
import {ArenaService} from './arena.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {BehaviorSubject, Observable, of, skip} from "rxjs";
import { SwapiEntity} from "../../../shared/models/swapi-rest.model";
import {WinnerDialogComponent} from "../../../shared/components/winner-dialog/winner-dialog.component";
import {AppStateService} from "../../../shared/services/app-state/app-state.service";
import {FIGHT_RESULT, GAME_TYPE, PLAYERS} from "../../../shared/models/game.model";

describe('ArenaService', () => {
  let service: ArenaService;
  let appStateService: AppStateService;
  let dialog: MatDialog;

  class MockAppStateService {

    _gameTypeSubject$: BehaviorSubject<GAME_TYPE> = new BehaviorSubject<GAME_TYPE>(GAME_TYPE.STARSHIPS);
    gameType$: Observable<GAME_TYPE> = of(GAME_TYPE.STARSHIPS);

    get selectedGameType(): GAME_TYPE {
      return GAME_TYPE.STARSHIPS;
    }

    get gameRoundNumber(): number {
      return 35;
    }

    updateGameRoundNumber(): void {
      jest.fn();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, MatDialogModule],
      providers: [{provide: AppStateService, useClass: MockAppStateService}]
    });
    service = TestBed.inject(ArenaService);
    appStateService = TestBed.inject(AppStateService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset page stream on clear arena state', (done) => {
    service['page$'].next(200);
    service['page$'].pipe(skip(1)).subscribe((page: number) => {
      expect(page).toEqual(1);
      done();
    });

    service.clearArenaState();
  });

  it('should reset last page subject stream on clear arena state', (done) => {
    service['_lastPageSubject$'].next(true);
    service['_lastPageSubject$'].pipe(skip(1)).subscribe((lastPage: boolean) => {
      expect(lastPage).toEqual(false);
      done();
    });

    service.clearArenaState();
  });

  it('should reset last page subject stream on clear arena state', (done) => {
    service['_activeBatchCardNumberSubject$'].next(9);
    service.activeBatchCardNumber$.pipe(skip(1)).subscribe((batchNumber: number) => {
      expect(batchNumber).toEqual(0);
      done();
    });

    service.clearArenaState();
  });

  it('should reset last page subject stream on clear arena state', (done) => {
    service['_roundsHistorySubject$'].next([FIGHT_RESULT.DRAW, FIGHT_RESULT.DRAW]);
    service.roundsHistory$.pipe(skip(1)).subscribe((roundsHistory: (PLAYERS | FIGHT_RESULT.DRAW)[]) => {
      expect(roundsHistory).toEqual([]);
      done();
    });

    service.clearArenaState();
  });

  it('should return correct winner or draw', () => {
    service['_roundsHistorySubject$'].next([PLAYERS.P1, PLAYERS.P2]);
    expect(service['getWinner']()).toEqual(FIGHT_RESULT.DRAW);

    service['_roundsHistorySubject$'].next([PLAYERS.P1, PLAYERS.P1]);
    expect(service['getWinner']()).toEqual(PLAYERS.P1);

    service['_roundsHistorySubject$'].next([PLAYERS.P2, PLAYERS.P2]);
    expect(service['getWinner']()).toEqual(PLAYERS.P2);
  });

  it('should update round history', (done) => {
    service['_roundsHistorySubject$'].next([PLAYERS.P1]);
    service.roundsHistory$.pipe(skip(1)).subscribe((history: (PLAYERS | FIGHT_RESULT.DRAW)[]) => {
    expect(history).toEqual([PLAYERS.P1, FIGHT_RESULT.DRAW]);
    done();
    }
  )
    service.updateRoundHistory(FIGHT_RESULT.DRAW);
  });

  it('should open end game modal', () => {
    const dialogConfig = { width: '750px', disableClose: true };

    jest.spyOn(dialog, 'open');
    service['endGame']();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open).toHaveBeenCalledWith(WinnerDialogComponent, dialogConfig);
  });

  it('should trigger endGame on active cards action if current round is last round', () => {
    jest.spyOn(service, 'endGame' as any);

    service.changeActiveCards();

    expect(service['endGame']).toHaveBeenCalledTimes(1);
  });

  it('should increment activeBatchCardNumber subject by one if current active batch card number is smaller than 9', (done) => {
    jest.spyOn(MockAppStateService.prototype, 'selectedGameType', 'get').mockReturnValue(GAME_TYPE.PEOPLE)
    service['_activeBatchCardNumberSubject$'].next(8);
    service.activeBatchCardNumber$.pipe(skip(1)).subscribe((activeBatchNumber: number) => {
      expect(activeBatchNumber).toEqual(9);
      done();
    });

    service.changeActiveCards();
  });

  it('should reset activeBatchCardNumber subject if current active batch card number is equal or higher than 9', (done) => {
    jest.spyOn(MockAppStateService.prototype, 'selectedGameType', 'get').mockReturnValue(GAME_TYPE.PEOPLE)
    service['_activeBatchCardNumberSubject$'].next(9);
    service.activeBatchCardNumber$.pipe(skip(1)).subscribe((activeBatchNumber: number) => {
      expect(activeBatchNumber).toEqual(0);
      done();
    });

    service.changeActiveCards();
  });

  it('should increment page number by one if current active batch card number is equal or higher than 9', (done) => {
    jest.spyOn(MockAppStateService.prototype, 'selectedGameType', 'get').mockReturnValue(GAME_TYPE.PEOPLE)
    service['_activeBatchCardNumberSubject$'].next(9);
    service['page$'].next(1);
    service['page$'].pipe(skip(1)).subscribe((page: number) => {
      expect(page).toEqual(2);
      done();
    });

    service.changeActiveCards();
  });

  it('should randomly shuffle given array of entities', () => {
    const mockedEntities: SwapiEntity[] = [
  {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/2/",
      "https://swapi.dev/api/films/3/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [],
    vehicles: [
      "https://swapi.dev/api/vehicles/14/",
      "https://swapi.dev/api/vehicles/30/"
    ],
    starships: [
      "https://swapi.dev/api/starships/12/",
      "https://swapi.dev/api/starships/22/"
    ],
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-20T21:17:56.891000Z",
    url: "https://swapi.dev/api/people/1/"
  },
  {
    name: "C-3PO",
    height: "167",
    mass: "75",
    hair_color: "n/a",
    skin_color: "gold",
    eye_color: "yellow",
    birth_year: "112BBY",
    gender: "n/a",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/2/",
      "https://swapi.dev/api/films/3/",
      "https://swapi.dev/api/films/4/",
      "https://swapi.dev/api/films/5/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [
      "https://swapi.dev/api/species/2/"
    ],
    vehicles: [],
    starships: [],
    created: "2014-12-10T15:10:51.357000Z",
    edited: "2014-12-20T21:17:50.309000Z",
    url: "https://swapi.dev/api/people/2/"
  },
  {
    name: "R2-D2",
    height: "96",
    mass: "32",
    hair_color: "n/a",
    skin_color: "white, blue",
    eye_color: "red",
    birth_year: "33BBY",
    gender: "n/a",
    homeworld: "https://swapi.dev/api/planets/8/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/2/",
      "https://swapi.dev/api/films/3/",
      "https://swapi.dev/api/films/4/",
      "https://swapi.dev/api/films/5/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [
      "https://swapi.dev/api/species/2/"
    ],
    vehicles: [],
    starships: [],
    created: "2014-12-10T15:11:50.376000Z",
    edited: "2014-12-20T21:17:50.311000Z",
    url: "https://swapi.dev/api/people/3/"
  },
  {
    name: "Darth Vader",
    height: "202",
    mass: "136",
    hair_color: "none",
    skin_color: "white",
    eye_color: "yellow",
    birth_year: "41.9BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/2/",
      "https://swapi.dev/api/films/3/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [],
    vehicles: [],
    starships: [
      "https://swapi.dev/api/starships/13/"
    ],
    created: "2014-12-10T15:18:20.704000Z",
    edited: "2014-12-20T21:17:50.313000Z",
    url: "https://swapi.dev/api/people/4/"
  },
  {
    name: "Leia Organa",
    height: "150",
    mass: "49",
    hair_color: "brown",
    skin_color: "light",
    eye_color: "brown",
    birth_year: "19BBY",
    gender: "female",
    homeworld: "https://swapi.dev/api/planets/2/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/2/",
      "https://swapi.dev/api/films/3/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [],
    vehicles: [
      "https://swapi.dev/api/vehicles/30/"
    ],
    starships: [],
    created: "2014-12-10T15:20:09.791000Z",
    edited: "2014-12-20T21:17:50.315000Z",
    url: "https://swapi.dev/api/people/5/"
  },
  {
    name: "Owen Lars",
    height: "178",
    mass: "120",
    hair_color: "brown, grey",
    skin_color: "light",
    eye_color: "blue",
    birth_year: "52BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/5/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [],
    vehicles: [],
    starships: [],
    created: "2014-12-10T15:52:14.024000Z",
    edited: "2014-12-20T21:17:50.317000Z",
    url: "https://swapi.dev/api/people/6/"
  },
  {
    name: "Beru Whitesun lars",
    height: "165",
    mass: "75",
    hair_color: "brown",
    skin_color: "light",
    eye_color: "blue",
    birth_year: "47BBY",
    gender: "female",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/5/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [],
    vehicles: [],
    starships: [],
    created: "2014-12-10T15:53:41.121000Z",
    edited: "2014-12-20T21:17:50.319000Z",
    url: "https://swapi.dev/api/people/7/"
  },
  {
    name: "R5-D4",
    height: "97",
    mass: "32",
    hair_color: "n/a",
    skin_color: "white, red",
    eye_color: "red",
    birth_year: "unknown",
    gender: "n/a",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
      "https://swapi.dev/api/films/1/"
    ],
    species: [
      "https://swapi.dev/api/species/2/"
    ],
    vehicles: [],
    starships: [],
    created: "2014-12-10T15:57:50.959000Z",
    edited: "2014-12-20T21:17:50.321000Z",
    url: "https://swapi.dev/api/people/8/"
  },
  {
    name: "Biggs Darklighter",
    height: "183",
    mass: "84",
    hair_color: "black",
    skin_color: "light",
    eye_color: "brown",
    birth_year: "24BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [
      "https://swapi.dev/api/films/1/"
    ],
    species: [],
    vehicles: [],
    starships: [
      "https://swapi.dev/api/starships/12/"
    ],
    created: "2014-12-10T15:59:50.509000Z",
    edited: "2014-12-20T21:17:50.323000Z",
    url: "https://swapi.dev/api/people/9/"
  },
  {
    name: "Obi-Wan Kenobi",
    height: "182",
    mass: "77",
    hair_color: "auburn, white",
    skin_color: "fair",
    eye_color: "blue-gray",
    birth_year: "57BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/20/",
    films: [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/2/",
      "https://swapi.dev/api/films/3/",
      "https://swapi.dev/api/films/4/",
      "https://swapi.dev/api/films/5/",
      "https://swapi.dev/api/films/6/"
    ],
    species: [],
    vehicles: [
      "https://swapi.dev/api/vehicles/38/"
    ],
    starships: [
      "https://swapi.dev/api/starships/48/",
      "https://swapi.dev/api/starships/59/",
      "https://swapi.dev/api/starships/64/",
      "https://swapi.dev/api/starships/65/",
      "https://swapi.dev/api/starships/74/"
    ],
    created: "2014-12-10T16:16:29.192000Z",
    edited: "2014-12-20T21:17:50.325000Z",
    url: "https://swapi.dev/api/people/10/"
  }
] as any as SwapiEntity[];
    const shuffledEntities: SwapiEntity[] = service['shuffleEntities'](mockedEntities);

    expect(JSON.stringify(mockedEntities) === JSON.stringify(shuffledEntities)).toBeFalsy();
  });
});
