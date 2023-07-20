export enum GAME_TYPE {
  PLANETS = 'planets',
  PEOPLE = 'people',
  STARSHIPS = 'starships'
}

export const BUFFER_VALUE = {
  [GAME_TYPE.PLANETS]: 60,
  [GAME_TYPE.PEOPLE]: 82,
  [GAME_TYPE.STARSHIPS]: 36
}

export enum FIGHT_RESULT {
  WON = 'won',
  DRAW = 'draw',
  LOST = 'lost'
}

export const VALUE_TO_COMPARE = {
  [GAME_TYPE.PEOPLE]: 'mass',
  [GAME_TYPE.STARSHIPS]: 'cost_in_credits',
  [GAME_TYPE.PLANETS]: 'diameter'
}

export enum PLAYERS {
  P1 = 'P1',
  P2 = 'P2'
}

export const MULTIPLIER = 1000;
