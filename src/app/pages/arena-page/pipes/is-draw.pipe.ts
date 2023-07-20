import { Pipe, PipeTransform } from '@angular/core';
import {FIGHT_RESULT} from "../../../shared/models/game.model";

@Pipe({
  name: 'isDraw',
  standalone: true
})
export class IsDrawPipe implements PipeTransform {

  transform(fightResult: FIGHT_RESULT): boolean {

    return fightResult === FIGHT_RESULT.DRAW;
  }

}
