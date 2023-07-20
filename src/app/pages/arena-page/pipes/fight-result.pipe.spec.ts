import { FightResultPipe } from './fight-result.pipe';
import { AppStateService } from "../../../shared/services/app-state/app-state.service";
import { ArenaService } from "../services/arena.service";
import { SwapiEntity } from "../../../shared/models/swapi-rest.model";
import { TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import {FIGHT_RESULT, GAME_TYPE} from "../../../shared/models/game.model";

describe('IsWinnerPipe', () => {
  let pipe: FightResultPipe;
  let appStateService: AppStateService;
  let arenaService: ArenaService;

  class MockAppStateService {

    _gameTypeSubject$: BehaviorSubject<GAME_TYPE> = new BehaviorSubject<GAME_TYPE>(GAME_TYPE.STARSHIPS);
    gameType$: Observable<GAME_TYPE> = of(GAME_TYPE.PEOPLE);

    get selectedGameType(): GAME_TYPE {
      return GAME_TYPE.PEOPLE;
    }

    get gameRoundNumber(): number {
      return 35;
    }

    updateGameRoundNumber(): void {
      jest.fn();
    }
  }

  class MockArenaService {
    readonly entities$: Observable<SwapiEntity[][]> = of([]);
    readonly activeBatchCardNumber$: Observable<number> = of(0)
    changeActiveCards(): void {
      jest.fn();
    }

    updateRoundHistory():void {
      jest.fn();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ArenaService, useClass: MockArenaService}, {provide: AppStateService, useClass: MockAppStateService}]
    });
    appStateService = TestBed.inject(AppStateService);
    arenaService = TestBed.inject(ArenaService);
    pipe = new FightResultPipe(appStateService, arenaService);
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return lost result based on given cardDecks', () => {
    const mockedLostCardDecks: SwapiEntity[][] = [
      [
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
      ],
      [
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
        }
        ]
    ] as any as SwapiEntity[][];

    expect(pipe.transform(mockedLostCardDecks, 0, 0)).toEqual(FIGHT_RESULT.LOST);
  });

  it('should return won result based on given cardDecks', () => {
    const mockedWonCardDecks: SwapiEntity[][] = [
      [
        {
          name: "C-3PO",
          height: "167",
          mass: "175",
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
        }
        ],
      [
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
        }
      ]
    ] as any as SwapiEntity[][];

    expect(pipe.transform(mockedWonCardDecks, 0, 0)).toEqual(FIGHT_RESULT.WON);
  });

  it('should return draw result based on given cardDecks', () => {
    const mockedWonCardDecks: SwapiEntity[][] = [
      [
        {
          name: "C-3PO",
          height: "167",
          mass: "175",
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
        }
        ],
      [
        {
          name: "Biggs Darklighter",
          height: "183",
          mass: "175",
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
        }
        ]
    ] as any as SwapiEntity[][];

    expect(pipe.transform(mockedWonCardDecks, 0, 0)).toEqual(FIGHT_RESULT.DRAW);
  });
});
