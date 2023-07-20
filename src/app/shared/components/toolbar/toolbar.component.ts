import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { AppStateService } from "../../services/app-state/app-state.service";
import { Observable, Subject, takeUntil } from "rxjs";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { ArenaService } from "../../../pages/arena-page/services/arena.service";
import { ToolbarService } from "./toolbar.service";
import { GAME_TYPE, MULTIPLIER } from "../../models/game.model";
@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatDialogModule
  ],
})
export class ToolbarComponent implements OnInit, OnDestroy{
  protected readonly MULTIPLIER: number = MULTIPLIER;
  private readonly destroySub$: Subject<void> = new Subject<void>();
  readonly entityTypes: GAME_TYPE[] = this.toolbarService.entityTypes;
  readonly isLoading$: Observable<boolean> = this.toolbarService.isLoading$;
  readonly p1Score$: Observable<number> = this.toolbarService.p1Score$;
  readonly p2Score$: Observable<number> = this.toolbarService.p2Score$;
  selectedEntityType$: Observable<GAME_TYPE> = this.toolbarService.selectedEntityType$;
  bufferValue$: Observable<number> = this.toolbarService.bufferValue$;
  filledProgressPercentage$: Observable<number> = this.toolbarService.filledProgressPercentage$;

  constructor(
    private appStateService: AppStateService,
    private arenaService: ArenaService,
    private toolbarService: ToolbarService
  ) {}

  onGameTypeChange(gameType: GAME_TYPE): void {
    this.toolbarService.onGameTypeChange(gameType);
  }

  ngOnInit(): void {
    this.appStateService.gameRoundNumber$.pipe(
      takeUntil(this.destroySub$)
    ).subscribe((roundNumber: number) => this.toolbarService.fillProgressPercentage(roundNumber))
  }

  ngOnDestroy(): void{
    this.destroySub$.next();
    this.destroySub$.complete();
  }

}
