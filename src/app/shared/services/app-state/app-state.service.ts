import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import {BUFFER_VALUE, FIGHT_RESULT, GAME_TYPE, PLAYERS} from "../../models/game.model";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly _gameTypeSubject$: BehaviorSubject<GAME_TYPE> = new BehaviorSubject<GAME_TYPE>(GAME_TYPE.PEOPLE);
  private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private readonly _p1Score$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _p2Score$: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly _gameRoundNumberSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly gameType$: Observable<GAME_TYPE> = this._gameTypeSubject$.asObservable();
  readonly isLoading$: Observable<boolean> = this._isLoading$.asObservable();
  readonly gameRoundNumber$: Observable<number> = this._gameRoundNumberSubject$.asObservable();
  readonly p1Score$: Observable<number> = this._p1Score$.asObservable();
  readonly p2Score$: Observable<number> = this._p2Score$.asObservable();

  get selectedGameType(): GAME_TYPE {
    return this._gameTypeSubject$.getValue();
  }

  get gameRoundNumber(): number {
    return this._gameRoundNumberSubject$.getValue();
  }

  changeSelectedEntityType(entity: GAME_TYPE): void {
    this._gameTypeSubject$.next(entity);
    this._gameRoundNumberSubject$.next(0);
  }

  setLoading(): void {
    this._isLoading$.next(true);
  }
  stopLoading(): void {
    this._isLoading$.next(false);
  }

  updateGameRoundNumber(newRoundNumber: number): void {
    if(newRoundNumber <= BUFFER_VALUE[this.selectedGameType]) {
      this._gameRoundNumberSubject$.next(newRoundNumber);
    }
  }

  endGame(winner: PLAYERS | FIGHT_RESULT.DRAW): void {
    this._gameRoundNumberSubject$.next(0);

    if(winner === FIGHT_RESULT.DRAW) return

    winner === PLAYERS.P1 ?
      this._p1Score$.next(this._p1Score$.getValue() + 1) :
      this._p2Score$.next(this._p2Score$.getValue() + 1);
  }
}
