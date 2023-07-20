import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {PLAYERS, FIGHT_RESULT, MULTIPLIER} from "../../models/game.model";

@Component({
  selector: 'app-winner-dialog',
  standalone: true,
  templateUrl: './winner-dialog.component.html',
  styleUrls: ['./winner-dialog.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WinnerDialogComponent {
  @Input() winner?: PLAYERS | FIGHT_RESULT.DRAW;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  protected readonly MULTIPLIER = MULTIPLIER;
  protected readonly FIGHT_RESULT = FIGHT_RESULT;
}
