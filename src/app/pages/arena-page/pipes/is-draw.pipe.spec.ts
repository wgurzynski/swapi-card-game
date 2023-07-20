import { IsDrawPipe } from './is-draw.pipe';
import { FIGHT_RESULT } from "../../../shared/models/game.model";

describe('IsDrawPipe', () => {
  it('create an instance', () => {
    const pipe: IsDrawPipe = new IsDrawPipe();
    expect(pipe).toBeTruthy();
  });

  it('should determine if is draw based on given fight result', () => {
    const pipe: IsDrawPipe = new IsDrawPipe();

    expect(pipe.transform(FIGHT_RESULT.LOST)).toBeFalsy();
    expect(pipe.transform(FIGHT_RESULT.WON)).toBeFalsy();
    expect(pipe.transform(FIGHT_RESULT.DRAW)).toBeTruthy();
  });
});
