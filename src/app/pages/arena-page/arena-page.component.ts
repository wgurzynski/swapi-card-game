import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {CardComponent} from "./components/card/card.component";
import {CommonModule, NgClass} from "@angular/common";
import {SwapiEntity} from "../../shared/models/swapi-rest.model";
import {ArenaService} from "./services/arena.service";
import { Observable, Subject, takeUntil } from "rxjs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AppStateService} from "../../shared/services/app-state/app-state.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FightResultPipe} from "./pipes/fight-result.pipe";
import {IsWinnerPipe} from "./pipes/is-winner.pipe";
import {IsDrawPipe} from "./pipes/is-draw.pipe";
import {GAME_TYPE} from "../../shared/models/game.model";

@Component({
  selector: 'app-arena-page',
  templateUrl: './arena-page.component.html',
  styleUrls: ['./arena-page.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    NgClass,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    FightResultPipe,
    IsWinnerPipe,
    IsDrawPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ArenaPageComponent implements OnInit, OnDestroy {
  private readonly destroySub$: Subject<void> = new Subject<void>();
  readonly isLoading$: Observable<boolean> = this.appStateService.isLoading$;
  readonly gameType$: Observable<GAME_TYPE> = this.appStateService.gameType$;
  activeBatchCardNumber = 0;
  cardDecks: SwapiEntity[][] = [];
  cardImages: string[] = [];

  constructor(private arenaService: ArenaService, private appStateService: AppStateService) {
  }
  ngOnInit(): void {
    this.arenaService.entities$.pipe(
      takeUntil(this.destroySub$)
    ).subscribe((entities:SwapiEntity[][] ) => {
      this.cardDecks = entities;
      this.generateMockCardImages();
    });
    this.arenaService.activeBatchCardNumber$.pipe(
      takeUntil(this.destroySub$)
    ).subscribe((activeBatchCardNumber: number ) => this.activeBatchCardNumber = activeBatchCardNumber);
  }

  ngOnDestroy(): void {
    this.destroySub$.next();
    this.destroySub$.complete();
  }

  changeActiveCards(): void {
    this.arenaService.changeActiveCards();
    this.generateMockCardImages();
  }

  private generateMockCardImages(): void {
    const gameType: GAME_TYPE = this.appStateService.selectedGameType;
    this.cardImages = [];
    this.cardDecks.map(() => this.cardImages.push(`./assets/img/cards/${gameType}/${gameType}_${Math.floor(Math.random() * 10) + 1}.jpg`))
  }
}
