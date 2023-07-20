import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {SwapiEntity} from "../../../../shared/models/swapi-rest.model";
import {CommonModule, NgSwitch, NgSwitchCase} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {GAME_TYPE} from "../../../../shared/models/game.model";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgSwitch,
    NgSwitchCase,
    MatIconModule,
    CommonModule
  ]
})
export class CardComponent {
  @Input() image = '';
  @Input() card!: SwapiEntity;
  @Input() gameType: GAME_TYPE = GAME_TYPE.PEOPLE;
  @Input() winner = false;
  readonly SWAPI_ENTITY_TYPE = GAME_TYPE;
}
