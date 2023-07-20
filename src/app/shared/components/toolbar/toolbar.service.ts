import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ProgressDialogComponent } from "../progress-dialog/progress-dialog.component";
import {BehaviorSubject, filter, map, Observable} from "rxjs";
import { AppStateService } from "../../services/app-state/app-state.service";
import { ArenaService } from "../../../pages/arena-page/services/arena.service";
import {BUFFER_VALUE, GAME_TYPE} from "../../models/game.model";

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  private readonly _filledProgressPercentageSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0) ;
  readonly entityTypes: GAME_TYPE[] = Object.values(GAME_TYPE);
  readonly isLoading$: Observable<boolean> = this.appStateService.isLoading$;
  readonly p1Score$: Observable<number> = this.appStateService.p1Score$;
  readonly p2Score$: Observable<number> = this.appStateService.p2Score$;
  readonly filledProgressPercentage$: Observable<number> = this._filledProgressPercentageSubject$.asObservable();
  readonly selectedEntityType$: Observable<GAME_TYPE> = this.appStateService.gameType$;
  readonly bufferValue$: Observable<number> = this.selectedEntityType$.pipe(map((selectedEntityType: GAME_TYPE) =>  BUFFER_VALUE[selectedEntityType]));
  constructor(
    private appStateService: AppStateService,
    private arenaService: ArenaService,
    private dialog: MatDialog
  ) { }

  private calculateProgressPercentage(roundNumber: number): number {
    return Math.round((roundNumber / BUFFER_VALUE[this.appStateService.selectedGameType]) * 100);
  }
  private changeGameType(gameType: GAME_TYPE): void {
    this.arenaService.clearArenaState();
    this.appStateService.changeSelectedEntityType(gameType);
    this._filledProgressPercentageSubject$.next(this.calculateProgressPercentage(0));
  }

  onGameTypeChange(gameType: GAME_TYPE): void {
    if (!this._filledProgressPercentageSubject$.getValue()) {
      this.changeGameType(gameType);

      return
    }

    const dialogRef: MatDialogRef<ProgressDialogComponent> = this.dialog.open(ProgressDialogComponent, {width: '650px'});

    dialogRef.componentInstance.closeModal.pipe(
      filter((discardChanges: boolean) => discardChanges),
    ).subscribe(() => {
      this.changeGameType(gameType);
    });
  }

  fillProgressPercentage(roundNumber: number) {
    this._filledProgressPercentageSubject$.next(this.calculateProgressPercentage(roundNumber))
  }
}
