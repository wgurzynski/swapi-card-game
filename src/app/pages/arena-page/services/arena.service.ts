import {Injectable} from '@angular/core';
import {SwapiServiceRest} from "./swapi-service-rest.service";
import {BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from "rxjs";
import {SwapiEntity, SwapiRest} from "../../../shared/models/swapi-rest.model";
import {AppStateService} from "../../../shared/services/app-state/app-state.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {WinnerDialogComponent} from "../../../shared/components/winner-dialog/winner-dialog.component";
import {BUFFER_VALUE, FIGHT_RESULT, GAME_TYPE, PLAYERS} from "../../../shared/models/game.model";

@Injectable({
  providedIn: 'root'
})
export class ArenaService {
  private readonly page$: BehaviorSubject<number> = new BehaviorSubject<number>(1)
  private readonly _lastPageSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private readonly _activeBatchCardNumberSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private readonly _roundsHistorySubject$: BehaviorSubject<(PLAYERS | FIGHT_RESULT.DRAW)[]> = new BehaviorSubject<(PLAYERS | FIGHT_RESULT.DRAW)[]>([]);
  readonly roundsHistory$: Observable<(PLAYERS | FIGHT_RESULT.DRAW)[]> = this._roundsHistorySubject$.asObservable();
  readonly activeBatchCardNumber$: Observable<number> = this._activeBatchCardNumberSubject$.asObservable();


  readonly entities$: Observable<SwapiEntity[][]> = combineLatest([this.page$, this.appStateService.gameType$.pipe(tap(() => this.page$.next(1)))]).pipe(
    tap(() => this.appStateService.setLoading()),
    switchMap(([page, selectedEntityType]) => this.swapiRestService.getEntity(selectedEntityType, page)),
    tap(({next}) => this._lastPageSubject$.next(!next)),
    map(({ results }: SwapiRest) => [this.shuffleEntities(results), this.shuffleEntities(results)]),
    tap(() => this.appStateService.stopLoading())
  );

  constructor(
    private swapiRestService: SwapiServiceRest,
    private appStateService: AppStateService,
    private dialog: MatDialog
  ) { }

  private shuffleEntities(array: SwapiEntity[]): SwapiEntity[] {
    const shuffledArray: SwapiEntity[] = array.slice()

    return shuffledArray.sort(() => Math.random() - 0.5);
  }

  changeActiveCards(): void {
    const activeBatchCardNumber: number = this._activeBatchCardNumberSubject$.getValue();
    const gameRoundNumber: number = this.appStateService.gameRoundNumber;
    const selectedGameType: GAME_TYPE = this.appStateService.selectedGameType;
    const isLastRound: boolean = gameRoundNumber === BUFFER_VALUE[selectedGameType] - 1;

    this.appStateService.updateGameRoundNumber(this.appStateService.gameRoundNumber + 1);

    if(isLastRound) return this.endGame();
    if(activeBatchCardNumber < 9) {
      this._activeBatchCardNumberSubject$.next(this._activeBatchCardNumberSubject$.getValue() + 1);
    } else {
      this._activeBatchCardNumberSubject$.next(0);
      this.page$.next(this.page$.getValue() + 1)
    }
  }

  private endGame(): void {
    const winner: PLAYERS | FIGHT_RESULT.DRAW = this.getWinner();
    const dialogRef: MatDialogRef<WinnerDialogComponent> = this.dialog.open(
      WinnerDialogComponent,
      { width: '750px', disableClose: true }
    );

    dialogRef.componentInstance.winner = winner

    dialogRef.componentInstance.closeModal.pipe().subscribe(() => {
      this.clearArenaState();
      this.appStateService.endGame(winner);
    });
  }

  updateRoundHistory(status: PLAYERS | FIGHT_RESULT.DRAW): void {
    this._roundsHistorySubject$.next([...this._roundsHistorySubject$.getValue(), status])
  }

  private getWinner(): PLAYERS | FIGHT_RESULT.DRAW {
    const winnerByRounds: (FIGHT_RESULT.DRAW | PLAYERS)[] = this._roundsHistorySubject$.getValue().filter((status) => status !== FIGHT_RESULT.DRAW);
    const p1Wins: number = winnerByRounds.filter((player: FIGHT_RESULT.DRAW | PLAYERS) => player === PLAYERS.P1).length;
    const p2Wins: number = winnerByRounds.filter((player: FIGHT_RESULT.DRAW | PLAYERS) => player === PLAYERS.P2).length;

    if(p1Wins === p2Wins) return FIGHT_RESULT.DRAW;
    return p1Wins > p2Wins ? PLAYERS.P1 : PLAYERS.P2;
  }

  clearArenaState(): void {
    this.page$.next(1);
    this._lastPageSubject$.next(false);
    this._activeBatchCardNumberSubject$.next(0);
    this._roundsHistorySubject$.next([]);
  }
}
