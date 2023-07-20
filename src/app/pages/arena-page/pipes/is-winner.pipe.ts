import {Pipe, PipeTransform} from '@angular/core';
import {FIGHT_RESULT} from "../../../shared/models/game.model";

@Pipe({
  name: 'isWinner',
  standalone: true
})
export class IsWinnerPipe implements PipeTransform {
  transform(fightResult: FIGHT_RESULT): boolean {

    return fightResult === FIGHT_RESULT.WON;
  }
}
