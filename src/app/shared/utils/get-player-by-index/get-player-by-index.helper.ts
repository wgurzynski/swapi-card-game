import {PLAYERS} from "../../models/game.model";

export function getPlayerByIndex(num: number): PLAYERS {
  const playersArray: PLAYERS[] = Object.values(PLAYERS);
  if (num >= 0 && num < playersArray.length) {
    return playersArray[num] as PLAYERS;
  } else {
    throw new Error('Invalid numeric value for the enum');
  }
}
