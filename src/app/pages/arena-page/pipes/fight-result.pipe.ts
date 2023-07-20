import {Pipe, PipeTransform} from '@angular/core';
import {SwapiEntity} from "../../../shared/models/swapi-rest.model";
import {AppStateService} from "../../../shared/services/app-state/app-state.service";
import {ArenaService} from "../services/arena.service";
import {getPlayerByIndex} from "../../../shared/utils/get-player-by-index/get-player-by-index.helper";
import {FIGHT_RESULT, GAME_TYPE, VALUE_TO_COMPARE} from "../../../shared/models/game.model";

@Pipe({
  name: 'FightResult',
  standalone: true,
  pure: true

})
export class FightResultPipe implements PipeTransform {

  constructor(private appStateService: AppStateService, private arenaService: ArenaService) {
  }

  transform(cardDecks: SwapiEntity[][], currentDeckIndex: number, activeBatchCardNumber: number): FIGHT_RESULT {
    const gameType: GAME_TYPE = this.appStateService.selectedGameType
    const userCard: SwapiEntity = cardDecks[currentDeckIndex][activeBatchCardNumber];
    const opponentsCardDecks: SwapiEntity[] = cardDecks
      .map((cardDeck: SwapiEntity[]) => cardDeck[activeBatchCardNumber])
      .filter((_opponentCard, index) => index !== currentDeckIndex);

    const opponentsValuesEqual: boolean = opponentsCardDecks.every((opponentCard: SwapiEntity) => {
      return ((Number(opponentCard[VALUE_TO_COMPARE[gameType] as keyof SwapiEntity]) || -1) === (Number(userCard[VALUE_TO_COMPARE[gameType] as keyof SwapiEntity]) || -1))
    });


    const opponentsValuesSmaller: boolean = opponentsCardDecks.every((opponentCard: SwapiEntity) => {
      return ((Number(opponentCard[VALUE_TO_COMPARE[gameType] as keyof SwapiEntity]) || -1) < (Number(userCard[VALUE_TO_COMPARE[gameType] as keyof SwapiEntity]) || -1))
    });


    if (opponentsValuesEqual) {
      this.arenaService.updateRoundHistory(FIGHT_RESULT.DRAW)
      return FIGHT_RESULT.DRAW
    }

    else if (opponentsValuesSmaller) {
      this.arenaService.updateRoundHistory(getPlayerByIndex(currentDeckIndex))
      return FIGHT_RESULT.WON
    }

    return FIGHT_RESULT.LOST
  }
}
