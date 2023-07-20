import {IsWinnerPipe} from './is-winner.pipe';
import {FIGHT_RESULT} from "../../../shared/models/game.model";

describe('IsWinnerPipe', () => {
  it('create an instance', () => {
    const pipe = new IsWinnerPipe();
    expect(pipe).toBeTruthy();
  });

  it('should determine if is winner based on given fight result', () => {
    const pipe: IsWinnerPipe = new IsWinnerPipe();

    expect(pipe.transform(FIGHT_RESULT.DRAW)).toBeFalsy();
    expect(pipe.transform(FIGHT_RESULT.LOST)).toBeFalsy();
    expect(pipe.transform(FIGHT_RESULT.WON)).toBeTruthy();
  });
});
