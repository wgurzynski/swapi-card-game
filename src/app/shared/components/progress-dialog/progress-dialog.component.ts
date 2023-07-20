import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-progress-dialog',
  standalone: true,
  templateUrl: './progress-dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  styleUrls: ['./progress-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressDialogComponent {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
}
